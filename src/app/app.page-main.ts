import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';

@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-main.html',
  styleUrls: ['./app.page-main.css', './app.page-main.settings.css', './app.page-main.firewalls.css', './app.page-main.osGUI.css', '/app.page-main.terminal.css']
})
export class PageMainComponent {
 
    // System stuff
    message               = '';
    msgFromServer:string  = '';
    _apiService:ApiService;

    // User stuff for the game
    bitcoin;
    totalPower: number
    prestigeMultiplier: number = 1
    hackMod: number = 1
    tempPowerIncrease: number = 1
    autoClickPower: number
    totalClickPower: number

    //Sound stuff
    audioArray = ['assets/sounds/sfx1.mp3', 'assets/sounds/sfx2.mp3', 'assets/sounds/sfx3.mp3']
    sound: boolean = false;
    soundImg: string = "assets/images/SoundOn.png";
    musicImg: string = "assets/images/musicOn.png";
    settingsImg: string = "assets/images/Settings.png";
    currentSong: string = "assets/sounds/songs/outbreak.mp3";
    musicPlayer;
    hoverSoundFile = 'assets/sounds/HoverSound.mp3'
    clickSoundFile = 'assets/sounds/ClickSound.mp3'

    // Volume Settings Stuff
    soundVolumeImg: string = 'assets/images/VolumeSettings0.6.png'
    musicVolumeImg: string = 'assets/images/VolumeSettings0.6.png'

    // Clickable stuff
    ramImg: string = "assets/images/ram.png";
    

    // UI stuff
    settingsState: boolean = false;
    osImgArray = ["os0p1.gif", "os1p1.gif", "os2p1.gif", "os3p1.gif", "os4p1.gif"]
    osState:boolean=false;
    guiState:boolean=false;
    osImgPath = 'assets/image/title-animation/os0p1.gif'
    shopImg = "assets/images/gui/shop.gif"
    prestigeImg = "assets/images/gui/prestige.gif"
    imgState = "hidden"
   
    // networkmenu stuff
    networkSelectMenuState: boolean=false;
    networkSelectMenu = "netClose"
    networkStatus = 'assets/images/gui/networks.gif'
    firewallArray;

    // firewall stuff
    currentFirewallImg;
    currentFirewallName;
    currentFirewallStats;
    currentSecurity: number = 1;

    // cli stuff
    outputState = 'outputClosed';
    commandArray;
    terminalState: boolean = false;
    userCommandArray;
    errorImg = 'assets/images/gui/error.gif'
    errorState = 'hidden'
    cliMessage;
    cliMessageWidth: string = 'height:0vw;';

    public site: string;
    path: any

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router: Router, pathService: pathService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
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
        // await this.getBitcoin()
        // await this.getUserPrestigeItems()
        await this.getUserItemArray()
        await this.startAutosave()
        await this.startAutoBitcoin()
        await this.setSound()
        await this.setCurrentMusic()
        await this.setMusic()
        await this.getCommandArray()
        //await this.moveRam()
        await this.setSoundVolume()
        await this.setMusicVolume()
        this.osShuffle()
        // await this.getFirewallArray()
        //console.log("Setup Complete!")
        console.log("-----------------------------------MAIN PAGE SETUP -----------------------------------------")
    }

    // simple boolean open/close switch for the outbreakSource menu (shop, prestige etc)
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

    // simple boolean open/close switch for the Network/Firewall selection menu
    toggleNetworkMenu(){
        if (this.networkSelectMenuState == true){
            this.networkSelectMenuState = false;
            this.networkSelectMenu = "netClose"
        }
        else if (this.networkSelectMenuState == false){
            this.networkSelectMenuState = true;
            this.networkSelectMenu = "netOpen"
        }
    }

    
    openTerminalOutput(){
            console.log("opening")
            this.cliMessageWidth = 'auto';
            this.outputState = 'outputOpen'
    }

    closeTerminalOutput(){
        console.log("closing")
        this.cliMessageWidth = 'height:0vw;';
        this.cliMessage = ''
        this.errorState = 'hidden';
        this.outputState = 'outputClosed'

    }


    // handles false returns on cli commands
    unknownCommand(command){
        this.cliMessage = command + " is not a command you know. Use help command to see known commands."
        this.errorState = 'visible'
    }

    clearInput(cli){
        console.log(cli)
        cli= '';
    }

    // recursive function to change the osImg randomly cause it looks cool
    osShuffle() {
        let rollNum = Math.floor(Math.random() * (this.osImgArray.length) );
        this.osImgPath = "assets/images/title_animations/" + this.osImgArray[rollNum];
        setTimeout (() => {
            this.osShuffle();
         }, 12000);
    }


    async getCommandArray(){
              // make a new array here
              var array = []
              // Locate what appropriate controller to use in the backend
              // (This path refers to a path in router.js)
              let url = this.site + 'Game/getCommands'
              // Send a GET request.
              // GET requests dont need to send any data from frontend to backend. GET is to just "get" stuff. Usually everything.
              this.http.get<any>(url)
                  .subscribe(
                      // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                      // If data is recieved from backend,
                      (data) => {
                          for(let i=0;i<data.length;i++){
                              array.push(data[i])
                          }
                          console.log('full command array: ', array)
                          this.commandArray = array;
                      } )
    }

    // Get the quantity of items the user bought from the database
    async getUserCommandArray(){
        // Locate what appropriate controller to use in the backend
        // (This path refers to a path in router.js)
        let url = this.site + 'user/getCommandArray'
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
                    let userCommandArray = data
                    // use that variable as parameter to getItems function
                    console.log('usercommandarray: ', userCommandArray)
                } )
    }

    async cli(command){
        // Locate what appropriate controller to use in the backend.
        // (This path refers to a path in router.js)
        let url = this.site + 'user/executeCommand'
        // Send a POST request with email data.
        // In UserController.js, this email data is recieved by "req.body.email".
        // This is how we get data from frontend(Angular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            command: command, email: sessionStorage.getItem("email")
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved from the backend,
                (data) => {
                    this.openTerminalOutput()
                    if (data == false){
                        this.unknownCommand(command)
                    }
                    else{
                        this.errorState = 'hidden';
                        eval(data.function)
                    }
                } )
    }


    // sets the stats of firewalls on load and when they are "hacked"
    setFirewallStats(i){
        // i is the index passed from this.firewallArray through HTML/user interaction
        this.currentFirewallStats = [i, this.firewallArray[i].securityMod, this.firewallArray[i].rewardMod]
        // the 8 here is arbitrary. potentially should be an exponential formula, e.g. 2^this.currentFirewallStats[1]
        this.currentSecurity = this.currentFirewallStats[1] * 8;
        // sets image and name for GUI
        this.currentFirewallName = this.firewallArray[i].name;
        this.currentFirewallImg = "assets/images/firewalls/" + this.firewallArray[i].image;
        console.log('currentFirewall: ', i, 'securityMod: ', this.firewallArray[i].securityMod, 'rewardMod: ', this.firewallArray[i].rewardMod)
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
                    //Assign this.bitcoin to whatever returned from the backend.
                    if (data == 'null'){
                        this.bitcoin = 0;
                    }
                    else{
                        this.bitcoin = data
                    }
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
                    console.log('useritemarray: ', userItemArray)
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
                    for(let i=0;i<data.length;i++){
                        array.push(data[i])
                    }
                    console.log('full item array: ', array)
                    this.getFirewallArray(array, userItemArray)
                    // this.calculatePowers(array, userItemArray)
                } )
    }


    // get list of firewalls from database
    async getFirewallArray(itemArray, userItemArray){
        let url = this.site + 'Game/getFirewalls'
        this.http.get<any>(url)
            .subscribe(

                (data) => {
                    this.firewallArray = data
                    console.log('firewall array: ', data)
                    this.setFirewallStats(0)
                    this.getUserPrestigeItems(itemArray, userItemArray, data)
                }
            )
        
    }


    async getUserPrestigeItems(itemArray, userItemArray, firewallArray){
        let url = this.site + 'user/getUserPrestigeItems'
        this.http.post<any>(url, {
            email: sessionStorage.getItem('email')
        })
            .subscribe(
                (data) => {
                    console.log('userprestigeitems: ', data)
                    this.getPrestigeItems(itemArray, userItemArray, firewallArray, data)
                }
            )
    }

    // Get all the prestige items in the database
    async getPrestigeItems(itemArray, userItemArray, firewallArray, userPrestigeItems) {
        // Locate which approrpiate controller function to use. In this case, we use getPrestigeItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    console.log('full prestige items: ', data)
                    this.calculatePrestigeMultiplier(itemArray, userItemArray, firewallArray, userPrestigeItems, data)
                } )
    }

    async calculatePrestigeMultiplier(itemArray, userItemArray, firewallArray, userPrestigeItems, prestigeArray) {
        let prestigeMultiplier = 1
        for(let i=0;i<prestigeArray.length;i++){
            if((prestigeArray[i].item == 'resHostRoot') || (prestigeArray[i].item == 'eduHostRoot')){
                prestigeMultiplier += userPrestigeItems[i] * prestigeArray[i].power
            }
        }
        if(prestigeMultiplier == 0){
            prestigeMultiplier = 1
        }
        console.log('calculatePrestigeMultiplier function: ', prestigeMultiplier)
        this.prestigeMultiplier = prestigeMultiplier
        this.calculateHackMod(itemArray, userItemArray, firewallArray, userPrestigeItems, prestigeArray)
    }

    async calculateHackMod(itemArray, userItemArray, firewallArray, userPrestigeItems, prestigeArray){
        let hackMod = 1
        hackMod = userPrestigeItems[0] * prestigeArray[0].power
        if(hackMod == 0){
            hackMod = 1
        }
        this.hackMod = hackMod
        this.calculatePowers(itemArray, userItemArray, firewallArray, userPrestigeItems, prestigeArray)
    }


    hackFirewall(){
        // Default value is 1 bitcoin per click. Items increase total clicking power which also increases bitcoin gain.
        if(this.prestigeMultiplier < 1 || NaN){
            this.prestigeMultiplier = 1
        }
        // console.log('hackfirewall function~~~~', 'this.currentSecurity: ', this.currentSecurity, 'this.totalClickPower: ', this.totalClickPower)
        this.currentSecurity = this.currentSecurity - this.totalClickPower

        if (this.currentSecurity < 1){
            this.increaseBitcoin()
        }

    }

    // Calculate total clicking power and auto click power
    calculatePowers(itemArray, userItemArray, firewallArray, userPrestigeItems, prestigeArray) {
        // Make totalpower and autoclickpower equal to zero (to make sure we dont re-add the power value)
        this.totalPower = 0
        this.autoClickPower = 0
        this.tempPowerIncrease = 1
        // for each item in userItemArray
        for(let i=0;i < userItemArray.length;i++){
            if(itemArray[i].item.includes('(Auto)')){
                this.autoClickPower += userItemArray[i] * itemArray[i].power
            } else {
                this.totalPower += userItemArray[i] * itemArray[i].power
            }
        }
        this.totalClickPower = ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease
        console.log('totalpower: ', this.totalPower, 'Prestige Multiplier: ', this.prestigeMultiplier, 'tempowerincrease: ', this.tempPowerIncrease, 'hackMod(bitcoin): ', this.hackMod)
        this.getBitcoin()
    }



    // This is how bitcoin is increased each click.
    increaseBitcoin() {

        if (this.bitcoin == 'null'){
            this.bitcoin = 0;
        }

        this.bitcoin += Math.floor( ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease * this.currentFirewallStats[2])
        this.totalClickPower = ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease
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
        console.log('--------------INCREASE BITCOIN FUNCTION----------------------')
        console.log('totalitempower: ', this.totalPower, 'hackmod: ', this.hackMod, 'tempowerincrease: ', this.tempPowerIncrease, 'currentfirewalstats[2]: ', this.currentFirewallStats[2])
        console.log('totalClickPower: ', this.totalClickPower, 'prestigeMultiplier: ', this.prestigeMultiplier)
        console.log('--You should be dealing: ', ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease, 'damage.--')
        console.log('--You should be gaining: ', Math.floor( ((1 + this.totalPower) * this.hackMod) * this.tempPowerIncrease * this.currentFirewallStats[2]), 'bitcoins.--')
        this.setFirewallStats(this.currentFirewallStats[0])
        console.log('firewall stats: ', this.currentFirewallStats)
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
        this.totalClickPower = ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease
        setTimeout(() => {
            this.tempPowerIncrease -= 1
            this.totalClickPower = ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease
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
                ram.classList.add('ram')
                let myleft = (Math.random())*(window.innerWidth - 200);
                let mytop = (Math.random())*(window.innerHeight - 200);
                ram.style.left = myleft + "px";
                ram.style.top = mytop + "px";
            }
        }, 1000)

    }
    // Function to open settings modal
    toggleSettings(){
        // Get the modal through the id
        var modal = document.getElementById("settingsBox");
        console.log(modal)
        if (this.settingsState == false){
            this.settingsState = true;
            this.settingsImg = 'assets/images/gui/close.gif'
            // Change css of modal to display it
            modal.style.display = "block"
        }
        else if (this.settingsState == true){
            this.settingsState = false;
            this.settingsImg = 'assets/images/Settings.png'
            modal.style.display = "none"
        }
        }

    // Function to close settings modal
    closeSettings(){
        // Get the modal through the id
        var modal = document.getElementById("settingsBox");
        // Change css of modal to be unable to see it
        modal.style.display = "none"
        }1

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

    // Function to lower sound volume when the minus sound volume button in the settings is clicked
    lowerSoundVolume(){
        // Gets the current sound volume
        let volume = parseFloat(sessionStorage.getItem('soundVolume'))
        // If the sound volume is not already at the minimum volume
        if (volume > 0){
            // Lowers the sound volume by 0.2
            volume -= 0.2
            // Attaches the new volume to the variable "changedVolume". Also fixes volume forma
            // To fit our needs.
            let changedVolume =  volume.toFixed(1).toString()
            // Sets the sound volume to the new, lowered volume
            sessionStorage.setItem('soundVolume', changedVolume)
            // Changes the sound volume image in the settings based on the new sound volume
            this.soundVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
        }
    }

    // Function to raise sound volume when the plus sound volume button in the settings is clicked
    raiseSoundVolume(){
        // Gets the current sound volume
        let volume = parseFloat(sessionStorage.getItem('soundVolume'))
        // If the sound volume is not already at the maximum volume
        if (volume < 1.0){
            // Raises the sound volume by 0.2
            volume += 0.2
            // Attaches the new volume to the variable "changedVolume". Also fixes volume forma
            // To fit our needs.
            let changedVolume =  volume.toFixed(1).toString()
            // Sets the sound volume to the new, raised volume
            sessionStorage.setItem('soundVolume', changedVolume)
            // Changes the sound volume image in the settings based on the new sound volume
            this.soundVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
        }
    }

    // Function to lower music volume when the minus music volume button in the settings is clicked
    lowerMusicVolume(){
        // Gets the current music volume
        let volume = parseFloat(sessionStorage.getItem('musicVolume'))
        // If the music volume is not already at the minimum volume
        if (volume > 0){
            // Lowers the music volume by 0.2
            volume -= 0.2
            // Attaches the new volume to the variable "changedVolume". Also fixes volume forma
            // To fit our needs. 
            let changedVolume =  volume.toFixed(1).toString()
            // Sets the music volume to the new, lowered volume 
            sessionStorage.setItem('musicVolume', changedVolume)
            // Changes the music volume image in the settings based on the new music volume
            this.musicVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
            // Changes the music volume to the new, lowered volume
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
    }

    // Function to lower music volume when the minus music volume button in the settings is clicked
    raiseMusicVolume(){
        // Gets the current music volume
        let volume = parseFloat(sessionStorage.getItem('musicVolume'))
        // If the music volume is not already at the maximum volume
        if (volume < 1.0){
            // Raises the music volume by 0.2
            volume += 0.2
            // Attaches the new volume to the variable "changedVolume". Also fixes volume forma
            // To fit our needs. 
            let changedVolume =  volume.toFixed(1).toString()
            // Sets the music volume to the new, raised volume 
            sessionStorage.setItem('musicVolume', changedVolume)
            // Changes the music volume image in the settings based on the new music volume
            this.musicVolumeImg = "assets/images/VolumeSettings" + changedVolume + ".png";
            // Changes the music volume to the new, raised volume
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
    }

    // Function to change music when a different song in the settings is selected
    musicSelection(){
        // Finds the selected song in the html
        let songSelect = <HTMLSelectElement>document.getElementById("musicSelection")
        // Gets the value of the selected song
        let selectedSong = songSelect.options[songSelect.selectedIndex].value
        // If the player picked the Main Theme
        if (selectedSong == "Theme"){
            // If the Main Theme is already playing
            if (this.currentSong == "assets/sounds/songs/theme.mp3"){
                // Say in the console that it's already playing
                console.log("Song already playing")
            }
            // If the Main Theme is not playing
            else {
                // Set the currentSong in storage to "Theme" 
                sessionStorage.setItem("currentSong", "Theme")
                // Change the current song
                this.currentSong = "assets/sounds/songs/theme.mp3"
                // Change the current song in the music player to the main theme
                this.musicPlayer.src = this.currentSong
                // Load the music player
                this.musicPlayer.load()
                // Play the song in the music player
                this.musicPlayer.play()
            }
        }
        // If the player picked "Outbreak" as the song
        else if (selectedSong == "Outbreak"){
            // If "Outbreak" is already playing
            if (this.currentSong == "assets/sounds/songs/outbreak.mp3"){
                // Say in console that it's already playing
                console.log("Song already playing")
            }
            // If "Outbreak" is not playing
            else {
                // Set the currentSong in storage to "Outbreak"
                sessionStorage.setItem("currentSong", "Outbreak")
                // Change the current song
                this.currentSong = "assets/sounds/songs/outbreak.mp3"
                // Change the current song in the music player to the "Outbreak" song
                this.musicPlayer.src = this.currentSong
                // Load the music player
                this.musicPlayer.load()
                // Play the song in the music player
                this.musicPlayer.play()
            }
        }
        // If the selected song is something else for an unknown reason
        else {
            // Say that there was an error in the console
            console.log("Error. This was not supposed to be selected")
        }
    }

    // Function to set the current music of the game to whatever the player set it to in the settings 
    async setCurrentMusic(){
        // If the song in the settings was changed
        if (sessionStorage.getItem("currentSong") != null){
            // If the Main Theme was selected
            if (sessionStorage.getItem("currentSong") == "Theme"){
                // Change the current song to the Main Theme
                this.currentSong = "assets/sounds/songs/theme.mp3"
            }
            // If the song "Outbreak" was selected
            else if (sessionStorage.getItem("currentSong") == "Outbreak"){
                // Change the current song to the Outbreak song
                this.currentSong = "assets/sounds/songs/outbreak.mp3"
            }
            // Find the option for the song in the html
            let option = <HTMLOptionElement>document.getElementById(sessionStorage.getItem("currentSong"))
            // Change the current selected song in the settings to the current song playing
            option.selected = true
        }
        // If the song in the settings was not changed
        else {
            // Set the currentSong in storage to "Outbreak"
            sessionStorage.setItem("currentSong", "Outbreak")
            // Change the current song
            this.currentSong = "assets/sounds/songs/outbreak.mp3"
        }
    }
}