import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { pathService } from './services/path.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-register.html',
  styleUrls:['./app.page-register.css']
})
export class PageRegisterComponent {
    // User's register credentials. These are filled when user submits their credentials.
    username = '';
    email = '';
    firstName = '';
    lastName = '';
    password = '';
    passwordConfirmation = '';

    itemArray: any;
    prestigeArray: any;
    commandArray: any;

    
    token                 = '';
    message               = '';
    _apiService:ApiService;
    public site:string;
    path:       any;

    soundOn = "assets/images/settings/SoundOn.png";
    soundOff = "assets/images/settings/SoundOff.png";
    soundImg = this.soundOn;
    musicOn =  "assets/images/settings/musicOn.png";
    musicOff =  "assets/images/settings/musicOff.png";
    musicImg = this.musicOn;
    musicPlayer = <HTMLAudioElement>document.getElementById("musicPlayer")
    currentSong: string = "assets/sounds/songs/theme.mp3";
    hoverSoundFile = 'assets/sounds/HoverSound.mp3'
    clickSoundFile = 'assets/sounds/ClickSound.mp3'

    
    // for osImg animation
    osImgPath: string = "";
    osImgArray = ["os0p1.gif", "os1p1.gif", "os2p1.gif", "os3p1.gif", "os4p1.gif"]
   
    // Volume Settings Stuff
    volumeBase = 'assets/images/settings/'
    soundVolumeImg = this.volumeBase + 'VolumeSettings0.6.png'
    musicVolumeImg = this.volumeBase + 'VolumeSettings0.6.png'

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, pathService: pathService, private router: Router) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.titleShuffle()
        this.setup()
    }

    async setup() {
        await this.getItems()
        await this.getPrestigeItems()
        await this.getCommandArray()
        await this.setSound()
        await this.setMusic()
        await this.setSoundVolume()
        await this.setMusicVolume()
        console.log("Setup Complete!")
    }

        // Get all of the items in the database
    async getItems() {
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
                    console.log('full item array: ', data)
                    this.itemArray = data
                } )
    }

    // Get all the prestige items in the database
    async getPrestigeItems() {
        // Locate which approrpiate controller function to use. In this case, we use getPrestigeItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    console.log('full prestige items: ', data)
                    this.prestigeArray = data
                } )
    }

    async getCommandArray(){
        // make a new array here
        console.log("trying to get commands?")
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

    titleShuffle() {
        let rollNum = Math.floor(Math.random() * (this.osImgArray.length) );

        this.osImgPath = "assets/images/title_animations/" + this.osImgArray[rollNum];
        setTimeout (() => {
            this.titleShuffle();
         }, 6000);
    }

    register() {
        // Locate which appropriate controller function to use. In this case, we're using RegisterUser in UserController.js.
        // (You can find where this leads in router.js file.)
        let url = this.site + "user/RegisterUser";

        let items = []
        let prestige = []
        let commands = ["help"]
        for(let i=0;i<this.itemArray.length;i++){
            items.push(0)
        }
        for(let i=0;i<this.prestigeArray.length;i++){
            prestige.push(0)
        }

    
        // Send a POST request with below data.
        // In UserController.js, this below data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post(url, {
                password: this.password,
                passwordConfirm: this.passwordConfirmation,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                username: this.username,
                items: items,
                prestige: prestige,
                commands: commands
            })
        .subscribe( 
        // Data is received from the post request.
        // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
        (data) => {
            // console log the recieved data (for debugging purposes)
            console.log(JSON.stringify(data));
            // let the user know what happened
            this.message = data["message"]
            if(data["message"] == "Registration successful. Please login."){
                console.log('Navigating...')
                this.router.navigate(['/page-login'])
            }
            }
        )
    }

    // This function is called when the using comes to the main page. Changes image and sound
    // settings based on what they were the last time you entered the main page.
    async setSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true'){
            // Keep sound on and change the image accordingly
            sessionStorage.setItem('sound', 'true')
            this.soundImg = this.soundOff;
        }
        // If sound is turned off
        else if (sessionStorage.getItem('sound') == 'false'){
            // Keep sound off and change the image accordingly
            sessionStorage.setItem('sound', 'false')
            this.soundImg = this.soundOff;
        }
        // If sound has not been set this session
        else {
            // Turn sound on
            sessionStorage.setItem('sound', 'true')
            this.soundImg = this.soundOn;
        }
    }

    // This function is called every time the user clicks on the sound icon to turn on/off the sound
    changeSound() {
        // If the session variable "sound" is set to "true"
        if (sessionStorage.getItem('sound') == 'true') {
            //Set the session variable "sound" to false and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            this.soundImg = this.soundOff;
        }

        // If the session variable "sound" is set to "false"
        else if (sessionStorage.getItem('sound') == 'false') {
            //Set the session variable "sound" to true and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            this.soundImg = this.soundOn;
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
            this.musicImg = this.musicOn;
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
            this.musicImg = this.musicOff
        }

        // If music has not been set yet
        else {
            // Turn music on, start playing music and change image accordingly
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.src = this.currentSong;
            this.musicPlayer.load();
            this.musicPlayer.play();
            this.musicImg = this.musicOn;
        }
    }

    // This function is called every time the user clicks on the music icon to turn on/off the music
    changeMusic() {
        // If music is turned on
        if (sessionStorage.getItem('music') == 'true'){
            // Turn off music, pause music, and change image accordingly
            sessionStorage.setItem('music', 'false');
            this.musicPlayer.pause()
            this.musicImg = this.musicOff;
            console.log("music off")
        }

        // If music is turned off
        else if (sessionStorage.getItem('music') == 'false'){
            // Turn on music, play music, and change image accordingly
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.play();
            this.musicImg = this.musicOff;
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

    // Function to set the sound volume when entering the page
    async setSoundVolume(){
        // If the sound volume has been set
        if (sessionStorage.getItem('soundVolume') != null){
            // Get the current sound volume
            let volume = sessionStorage.getItem('soundVolume')
            // Change the sound volume image in the settings based on the current sound volume
            this.soundVolumeImg = this.volumeBase + volume + ".png";
        }
        // If the sound volume has not been set
        else {
            // Set the sound volume to the value 0.6 (around mid-range volume)
            sessionStorage.setItem('soundVolume', '0.6')
            // Get the newly set sound volume
            let volume = sessionStorage.getItem('soundVolume')
            // Change the sound volume image in the settings based on the new sound volume
            this.soundVolumeImg = this.volumeBase + volume + ".png";
        }
    }
    
    // Function to set the music volume when entering the page
    async setMusicVolume() {
        // If the music volume has been set
        if (sessionStorage.getItem('musicVolume') != null){
            // Get the current music volume
            let volume = sessionStorage.getItem('musicVolume')
            // Change the music volume image in the settings based on the current music volume
            this.musicVolumeImg = this.volumeBase + volume + ".png";
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
            this.musicVolumeImg = this.volumeBase + volume + ".png";
            // Change the volume of the music to the current music volume
            this.musicPlayer.volume = parseFloat(sessionStorage.getItem('musicVolume'))
        }
    }
}