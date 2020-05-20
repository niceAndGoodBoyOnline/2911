import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';


@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-login.html',
  styleUrls: ['./app.page-login.css']
})
export class PageLoginComponent {
    // Hard-code credentials for convenience.
    password              = '';         
    username              = '';
    
    token                 = '';
    message               = '';
    _apiService:ApiService;

    // for title screen animation
    osImgPath: string = "";
    osImgArray = ["os0p1.gif", "os1p1.gif", "os2p1.gif", "os3p1.gif", "os4p1.gif"]
    
    // for title screen music
    soundOn = "assets/images/settings/SoundOn.png";
    soundOff = "assets/images/settings/SoundOff.png";
    soundImg = this.soundOn;
    musicOn =  "assets/images/settings/musicOn.png";
    musicOff =  "assets/images/settings/musicOff.png";
    musicImg = this.musicOn;
    musicPlayer;
    currentSong: string = "assets/sounds/songs/theme.mp3";
    hoverSoundFile = 'assets/sounds/HoverSound.mp3'
    clickSoundFile = 'assets/sounds/ClickSound.mp3'

    // Volume Settings Stuff
    volumeBase = 'assets/images/settings/'
    soundVolumeImg = this.volumeBase + 'VolumeSettings0.6.png'
    musicVolumeImg = this.volumeBase + 'VolumeSettings0.6.png'

    site: string;
    path: any;
    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router:Router, pathService: pathService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.titleShuffle()
        this.setupSound()
    }

    async setupSound(){
        this.musicPlayer = <HTMLAudioElement>document.getElementById("musicPlayer")
        this.musicPlayer.loop = true;
        this.musicPlayer.volume = 0.5;
        await this.setSound()
        await this.setMusic()
        await this.setSoundVolume()
        await this.setMusicVolume()
    }


    titleShuffle() {
        let rollNum = Math.floor(Math.random() * (this.osImgArray.length) );

        this.osImgPath = "assets/images/title_animations/" + this.osImgArray[rollNum];
        setTimeout (() => {
            this.titleShuffle();
         }, 6000);
    }

    login() {
        let url = this.site + "auth";
    
        // This free online service receives post submissions.
        this.http.post(url, {
                username:  this.username,
                password:  this.password,
            })
        .subscribe( 
        // Data is received from the post request.
        // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
        (data) => {
            // Inspect the data to know how to parse it.
            console.log(JSON.stringify(data));
            // If token in data exists,
            if(data["token"]  != null)  {
                // Make variables in sessionStorage (auth_token, username, email, save) and assign them to whatever
                // Set multiple variables (this.token, this.message) to whatever
                this.token = data["token"]     
                sessionStorage.setItem('auth_token', data["token"]);
                sessionStorage.setItem('username', data["username"]);
                sessionStorage.setItem('email', data['email']);
                sessionStorage.setItem('save', 'false')
                sessionStorage.setItem('autoClick', 'false')
                sessionStorage.setItem('ramTimer', 'false')
                this.message = "The user has been logged in."
                this.musicPlayer.pause()
                // When logged in successfully, take user to main page
                this.router.navigate(['/page-main'])
            }    
        },
        // An error occurred. Data is not received. 
        error => {
            this.message = "Something went wrong. Wrong username or password maybe?";             
        });
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