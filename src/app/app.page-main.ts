import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';

import { pathService } from './services/path.service';

@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-main.html',
  styleUrls: ['./app.page-main.css']
})
export class PageMainComponent {
 
    // System stuff
    message               = '';
    msgFromServer:string  = '';
    _apiService:ApiService;

    // User stuff for the game
    bitcoin: number
    totalPower: number
    hackMod: number
    tempPowerIncrease: number = 1
    autoClickPower: number
    totalClickPower: number

    //Sound stuff
    audioArray = ['assets/sounds/sfx1.mp3', 'assets/sounds/sfx2.mp3', 'assets/sounds/sfx3.mp3']
    sound: boolean = false;
    soundImg: string = "assets/images/SoundOn.png";
    musicImg: string = "assets/images/musicOn.png";
    settingsImg: string = "assets/images/Settings.png";
    songList: ["assets/sounds/songs/theme.mp3"];
    currentSong: string = "assets/sounds/songs/outbreak.mp3";
    musicPlayer;
    hoverSoundFile = 'assets/sounds/HoverSound.mp3'
    clickSoundFile = 'assets/sounds/ClickSound.mp3'

    // Volume Settings Stuff
    soundVolumeImg: string = 'assets/images/VolumeSettings0.6.png'
    musicVolumeImg: string = 'assets/images/VolumeSettings0.6.png'

    // Clickable stuff
    ramImg: string = "assets/images/ram.png";
    

    // expUI stuff
    osState:boolean=false;
    guiState:boolean=false;
    osImg = 'assets/images/title_animations/os0p1.gif'
    shopImg = "assets/images/gui/shop.png"
    multiImg = "assets/images/gui/multi.png"
    prestigeImg = "assets/images/gui/prestige.png"
    imgState = "hidden"
   

    // firewall stuff
    currentFirewall = "assets/images/firewalls/firewall25.gif"
    currentName = "r3dGate"
    
    // mission stuff
    currentMission;

    public site: string;
    path: any

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router: Router, pathService: pathService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.guiSetup()
        this.setup()
        sessionStorage.setItem('inshop', 'false')
    }
    
    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        this.musicPlayer = <HTMLAudioElement>document.getElementById("musicPlayer");
        this.musicPlayer.loop = true;
        this.musicPlayer.volume = 0.5;
        await this.checkLoggedIn()
        await this.getBitcoin()
        await this.getUserPrestigeItems()
        await this.getUserItemArray()
        await this.startAutosave()
        await this.startAutoBitcoin()
        await this.setSound()
        await this.setMusic()
        await this.moveRam()
        await this.setSoundVolume()
        await this.setMusicVolume()
        console.log("Setup Complete!")
    }
    
    guiSetup(){
    }

    toggleOS(){
        console.log("stub, not implemented")
    }

    toggleGUI(){
        if (this.guiState === true){
            this.guiState = false
            this.imgState = "hidden"
        }
        else if (this.guiState == false){
            this.guiState = true
            this.imgState = "visible"
        }
    }


    // Checks if user is logged in
    checkLoggedIn() {
        // If variable 'username' in session storage is empty,
        if(sessionStorage.getItem('username') == null){
            // navigate user to login page
            this.router.navigate(['page-login'])
        }
    }

    // Get the amount of bitcoins the user has from the database to display in the main page
    getBitcoin() {
        // Locate what appropriate controller to use in the backend.
        // (This path refers to a path in router.js)
        let url = this.site + 'user/getBitcoin'
        // Send a POST request with email data.
        // In UserController.js, this email data is recieved by "req.body.email".
        // This is how we get data from frontend(Angular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved from the backend,
                (data) => {
                    // Assign this.bitcoin to whatever returned from the backend.
                    this.bitcoin = data
                } )
    }


    // Get the quantity of items the user bought from the database
    async getUserItemArray(){
        // Locate what appropriate controller to use in the backend
        // (This path refers to a path in router.js)
        let url = this.site + 'user/getItemArray'
        // Send a POST request with email data.
        // In UserController.js, this email data is recieved by "req.body.email"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved from the backend,
                (data) => {
                    //console log the data (for debugging purposes)
                    //console.log(data)
                    // create a variable here and assign it to data
                    let userItemArray = data
                    // use that variable as parameter to getItems function
                    this.getItems(userItemArray)
                } )
    }

    // Get all of the items in the database
    getItems(userItemArray) {
        // make a new array here
        var array = []
        // Locate what appropriate controller to use in the backend
        // (This path refers to a path in router.js)
        let url = this.site + 'Game/getItems'
        // Send a GET request.
        // GET requests dont need to send any data from frontend to backend. GET is to just "get" stuff. Usually everything.
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved from backend,
                (data) => {
                    // for each item in the recieved data, put the item power in the array we just made.
                    for(let i=0;i<data.length;i++){
                        array.push(data[i])
                    }
                    // Calculate the total power with the array we made and the array we have that was passed from getUserItemArray.
                    this.calculatePowers(array, userItemArray)
                } )
    }

    async getUserPrestigeItems(){
        let url = this.site + 'user/getUserPrestigeItems'
        this.http.post<any>(url, {
            email: sessionStorage.getItem('email')
        })
            .subscribe(
                (data) => {
                    let userPrestigeItems = data
                    this.getPrestigeItems(data)
                }
            )
    }

    // Get all the prestige items in the database
    async getPrestigeItems(userPrestigeItems) {
        // Locate which approrpiate controller function to use. In this case, we use getPrestigeItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (For debugging purposes).
                    let prestigeArray = data
                    this.calculateHackMod(userPrestigeItems, prestigeArray)
                } )
    }

    async calculateHackMod(userPrestigeItems, prestigeArray) {
        let hackMod = 0
        hackMod = userPrestigeItems[0] * prestigeArray[0].power
        this.hackMod = hackMod
    }

    // Calculate total clicking power and auto click power
    calculatePowers(itemArray, userItemArray) {
        // Make totalpower and autoclickpower equal to zero (to make sure we dont re-add the power value)
        this.totalPower = 0
        this.autoClickPower = 0
        this.tempPowerIncrease = 1
        this.hackMod = 1
        // for each item in userItemArray
        for(let i=0;i < userItemArray.length;i++){
            if(itemArray[i].item.includes('(Auto)')){
                this.autoClickPower += userItemArray[i] * itemArray[i].power
            } else {
                this.totalPower += userItemArray[i] * itemArray[i].power
            }
        }
        this.totalClickPower = ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease
    }

    // This is how bitcoin is increased each click.
    increaseBitcoin() {
        // Default value is 1 bitcoin per click. Items increase total clicking power which also increases bitcoin gain.
        if(this.hackMod == 0){
            this.hackMod = 1
        }
        this.bitcoin += ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease
        this.totalClickPower = ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease
        if (sessionStorage.getItem('sound') == 'true') {
            // Instantiate an audio player to play the clicking sounds.
            let audio = new Audio()
            // Randomly pick which sound to play from this.audioArray array
            audio.src = this.audioArray[Math.floor(Math.random() * this.audioArray.length)]
            // Set the volume of the sound
            audio.volume = parseFloat(sessionStorage.getItem('soundVolume'))
            // Once a sound is chosen, load it.
            audio.load();
            // Play it.
            audio.play();
        }
    }
           
    // This function is called when the using comes to the main page. Changes image and sound
    // settings based on what they were the last time you entered the main page.
    async setSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true'){
            // Keep sound on and change the image accordingly
            sessionStorage.setItem('sound', 'true')
            this.soundImg = "assets/images/SoundOn.png";
        }
        // If sound is turned off
        else if (sessionStorage.getItem('sound') == 'false'){
            // Keep sound off and change the image accordingly
            sessionStorage.setItem('sound', 'false')
            this.soundImg = "assets/images/SoundOff.png";
        }
        // If sound has not been set this session
        else {
            // Turn sound on
            sessionStorage.setItem('sound', 'true')
            this.soundImg = "assets/images/SoundOn.png";
        }
    }

    // This function is called every time the user clicks on the sound icon to turn on/off the sound
    changeSound() {
        // If the session variable "sound" is set to "true"
        if (sessionStorage.getItem('sound') == 'true') {
            //Set the session variable "sound" to false and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            this.soundImg = "assets/images/SoundOff.png";
        }

        // If the session variable "sound" is set to "false"
        else if (sessionStorage.getItem('sound') == 'false') {
            //Set the session variable "sound" to true and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            this.soundImg = "assets/images/SoundOn.png";
        }
    }

    // This function is called when the using comes to the main page. Changes image and music
    // settings based on what they were the last time you entered the main page.
    async setMusic() {
        // If music is turned on
        if (sessionStorage.getItem('music') == 'true'){
            // Keep music on
            sessionStorage.setItem('music', 'true')
            // Change image accordingly
            this.musicImg = "assets/images/musicOn.png"
            // If music has already been playing, tell this in the console
            if (this.musicPlayer.duration > 0 && !this.musicPlayer.paused) {
                console.log("Music already playing")
            }
            // If music is not playing
            else {
                // Start music
                this.musicPlayer.src = this.currentSong;
                this.musicPlayer.load();
                this.musicPlayer.play();
                
            }
        }

        // If music is turned off
        else if (sessionStorage.getItem('music') == 'false'){
            // Keep music off
            sessionStorage.setItem('music', 'false');
            // Pause music and change image accordingly
            this.musicPlayer.pause()
            this.musicImg = "assets/images/musicOff.png"
        }

        // If music has not been set yet
        else {
            // Turn music on, start playing music and change image accordingly
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.src = this.currentSong;
            this.musicPlayer.load();
            this.musicPlayer.play();
            this.musicImg = "assets/images/musicOn.png"
        }
    }

    // This function is called every time the user clicks on the music icon to turn on/off the music
    changeMusic() {
        // If music is turned on
        if (sessionStorage.getItem('music') == 'true'){
            // Turn off music, pause music, and change image accordingly
            sessionStorage.setItem('music', 'false');
            this.musicPlayer.pause()
            this.musicImg = "assets/images/musicOff.png"
            console.log("music off")
        }

        // If music is turned off
        else if (sessionStorage.getItem('music') == 'false'){
            // Turn on music, play music, and change image accordingly
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.play();
            this.musicImg = "assets/images/musicOn.png"
        }
    }

    // This function plays a sound when the user hovers over a button.
    hoverSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true') {
            // Create an audio instance to play the file
            let audio = new Audio()
            // Set the sound file to play
            audio.src = this.hoverSoundFile
            // Set the volume of the sound
            audio.volume = parseFloat(sessionStorage.getItem('soundVolume'))
            // Load the audio instance with the sound file
            audio.load();
            // Play it.
            audio.play();
        }
    }

    // This function plays a sound when the user clicks on a button.
    clickSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true') {
            // Create an audio instance to play the file
            let audio = new Audio()
            // Set the sound file to play
            audio.src = this.clickSoundFile
            // Set the volume of the sound
            audio.volume = parseFloat(sessionStorage.getItem('soundVolume'))
            // Load the audio instance with the sound file
            audio.load();
            // Play it.
            audio.play();
        }
    }


    // This function is called every time the user clicks on the shop button
    async openShop() {
        // Save progress
        await this.saveProgress()
        // Navigate user to the shop page
        this.router.navigate(['page-shop'])
    }

    // This function is called every time the user clicks on the prestige shop button
    async openPrestige() {
        // Save progress
        await this.saveProgress()
        // Navigate user to the prestige shop page
        this.router.navigate(['page-prestige'])
    }

    // Function to save progress
    saveProgress() {
        // Let em know that this function is being called (for debugging purposes)
        //console.log('Saving Progress..')
        // Locate what appropriate controller to use in the backend
        // (This path refers to a path in router.js)
        let url = this.site + 'user/saveProgress'
        // Send a POST request with email and bitcoin data.
        // In UserController.js, this data is recieved by "req.body.[what data we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved from backend,
                (data) => {
                    // Let the user know that the save is successful (From the backend, a string is returned. Hence "data" is a string this time)
                    this.message = data
                } )
    }

    //Can someone figure out how to call saveProgress() in setInterval? I cant seem to do it so i just retyped the saveProgress() function lol
    // Autosave function that is called everytime the user is in the main page
    startAutosave() {
        // This "if" statement is so that it prevents multiple save instances when clicking "refresh" or going to the shop and back
        // if(sessionStorage.getItem('save') == 'false'){
        //     sessionStorage.setItem('save', 'true')
            // Set how often the below code is executed.
            // Code below is the same thing as saveProgress()
            let interval = setInterval(() => {
                // If the user is logged out, or if user is in shop,
                if((sessionStorage.getItem('auth_token') == null) || ((sessionStorage.getItem('inshop') != 'false'))){
                    // Stop the autosave.
                    clearInterval(interval)
                    console.log('Autosave has been stopped.')
                    sessionStorage.setItem('save', 'false')
                    return
                }
                // otherwise, save
                //console.log('Saving Progress..')
                let url = this.site + 'user/saveProgress'
                this.http.post<any>(url, {
                    email: sessionStorage.getItem("email"),
                    bitcoin: this.bitcoin
                })
                    .subscribe(
                        // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                        (data) => {
                           // console.log(data)
                        } )
            }, 1000)
        // } else {
        //     // If there is an existing autosave instance, let em know in the console.
        //     //console.log('Automated saving is not allowed to be (re)activated at this time.')
        // }
    }

    startAutoBitcoin() {
            let autoClick = setInterval(() => {
                if((sessionStorage.getItem('auth_token') == null) || ((sessionStorage.getItem('inshop') != 'false'))){
                    clearInterval(autoClick)
                    sessionStorage.setItem('autoClick', 'false')
                    return
                }
                this.bitcoin += this.autoClickPower
            }, 100)
        }

    

    increaseTempPower() {
        let ram = document.getElementById('ram')
        ram.style.display = 'none'
        this.tempPowerIncrease += 1
        this.totalClickPower = ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease
        setTimeout(() => {
            this.tempPowerIncrease -= 1
            this.totalClickPower = ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease
        }, 10000)
    }

    moveRam(){
        if(sessionStorage.getItem('ramTimer') == 'true'){
            console.log('Ram already running. If you refreshed, please log out and log in.')
            return
        }
        sessionStorage.setItem('ramTimer', 'true')
        let ramInterval = setInterval(() => {
            if((sessionStorage.getItem('auth_token') == null) || ((sessionStorage.getItem('inshop') != 'false'))){
                clearInterval(ramInterval)
                console.log('ramInterval has been stopped')
                sessionStorage.setItem('ramTimer', 'false')
                return
            }
            let number = Math.floor(Math.random() * 10)
            if(number > 7){
                let ram = document.getElementById('ram')
                ram.style.display = "inline"    
                ram.style.width = "200px"
                ram.style.height = "200px"
                ram.style.position = "absolute"
                let myleft = (Math.random())*(window.innerWidth - 200);
                let mytop = (Math.random())*(window.innerHeight - 200);
                ram.style.left = myleft + "px";
                ram.style.top = mytop + "px";
            }
        }, 1000)

    }
    // Function to open settings modal
    openSettings(){
        // Get the modal through the id
        var modal = document.getElementById("settingsBox");
        // Change css of modal to display it
        modal.style.display = "block"
        }

    // Function to close settings modal
    closeSettings(){
        // Get the modal through the id
        var modal = document.getElementById("settingsBox");
        // Change css of modal to be unable to see it
        modal.style.display = "none"
        }

    // Function to set the sound volume when entering the page
    async setSoundVolume(){
        // If the sound volume has been set
        if (sessionStorage.getItem('soundVolume') != null){
            // Get the current sound volume
            let volume = sessionStorage.getItem('soundVolume')
            // Change the sound volume image in the settings based on the current sound volume
            this.soundVolumeImg = "assets/images/VolumeSettings" + volume + ".png";
        }
        // If the sound volume has not been set
        else {
            // Set the sound volume to the value 0.6 (around mid-range volume)
            sessionStorage.setItem('soundVolume', '0.6')
            // Get the newly set sound volume
            let volume = sessionStorage.getItem('soundVolume')
            // Change the sound volume image in the settings based on the new sound volume
            this.soundVolumeImg = "assets/images/VolumeSettings" + volume + ".png";
        }
    }

    // Function to set the music volume when entering the page
    async setMusicVolume() {
        // If the music volume has been set
        if (sessionStorage.getItem('musicVolume') != null){
            // Get the current music volume
            let volume = sessionStorage.getItem('musicVolume')
            // Change the music volume image in the settings based on the current music volume
            this.musicVolumeImg = "assets/images/VolumeSettings" + volume + ".png";
            // Change the volume of the music to the current music volume
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
        // If the music volume has not been set
        else {
            // Set the music volume to the value 0.6 (around mid-range volume)
            sessionStorage.setItem('musicVolume', '0.6')
            // Get the newly set music volume
            let volume = sessionStorage.getItem('musicVolume')
            // Change the music volume image in the settings based on the new music volume
            this.musicVolumeImg = "assets/images/VolumeSettings" + volume + ".png";
            // Change the volume of the music to the current music volume
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
    }

    lowerSoundVolume(){
        let volume = parseFloat(sessionStorage.getItem('soundVolume'))
        if (volume > 0){
            volume -= 0.2
            let changedVolume =  volume.toFixed(1).toString()
            console.log(changedVolume)
            sessionStorage.setItem('soundVolume', changedVolume)
            this.soundVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
        }
    }
    raiseSoundVolume(){
        let volume = parseFloat(sessionStorage.getItem('soundVolume'))
        if (volume < 1.0){
            volume += 0.2
            let changedVolume =  volume.toFixed(1).toString()
            console.log(changedVolume)
            sessionStorage.setItem('soundVolume', changedVolume)
            this.soundVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
        }
    }
    lowerMusicVolume(){
        let volume = parseFloat(sessionStorage.getItem('musicVolume'))
        if (volume > 0){
            volume -= 0.2
            let changedVolume =  volume.toFixed(1).toString()
            console.log(changedVolume)
            sessionStorage.setItem('musicVolume', changedVolume)
            this.musicVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
    }
    raiseMusicVolume(){
        let volume = parseFloat(sessionStorage.getItem('musicVolume'))
        if (volume < 1.0){
            volume += 0.2
            let changedVolume =  volume.toFixed(1).toString()
            console.log(changedVolume)
            sessionStorage.setItem('musicVolume', changedVolume)
            this.musicVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
    }
}