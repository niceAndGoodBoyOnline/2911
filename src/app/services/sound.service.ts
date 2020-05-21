import { Injectable } from '@angular/core';

@Injectable() 
export class soundService {

    musicPlayer;

    // for title screen music
    soundOn = "assets/images/settings/SoundOn.png";
    soundOff = "assets/images/settings/SoundOff.png";
    soundImg = this.soundOn;
    musicOn =  "assets/images/settings/musicOn.png";
    musicOff =  "assets/images/settings/musicOff.png";
    musicImg = this.musicOn;
    soundBase = "assets/sounds/"
    currentSong = this.soundBase + 'songs/theme.mp3';
    hoverSoundFile = this.soundBase + 'HoverSound.mp3'
    clickSoundFile = 'ClickSound'
    accessGranted = this.soundBase + 'access.mp3'
    soundCoolDown: boolean = true;
    hackSoundsArray = ['sfx1','sfx2','sfx3'];

    // Volume Settings Stuff
    volumeBase = 'assets/images/settings/VolumeSettings'
    soundVolumeImg = this.volumeBase + '0.4.png'
    musicVolumeImg = this.volumeBase + '0.4.png'

  constructor() { }

  async setupSound(){
    this.musicPlayer = <HTMLAudioElement>document.getElementById("musicPlayer")
    this.musicPlayer.loop = true;
    this.musicPlayer.volume = 0.5;
    await this.setSound()
    await this.setMusic()
    await this.setSoundVolume()
    await this.setMusicVolume()
}

  // This function is called when the using comes to the main page. Changes image and sound
    // settings based on what they were the last time you entered the main page.
    async setSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true'){
            // Keep sound on and change the image accordingly
            sessionStorage.setItem('sound', 'true')
            this.soundImg = this.soundOn;
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
        }

        // If music is turned off
        else if (sessionStorage.getItem('music') == 'false'){
            // Turn on music, play music, and change image accordingly
            sessionStorage.setItem('music', 'true')
            this.musicPlayer.play();
            this.musicImg = this.musicOn;
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
    clickSound(sound=this.clickSoundFile) {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true') {
            if (this.soundCoolDown == true){
                this.soundCoolDown = false;
                setTimeout(()=> {this.soundCoolDown = true}, 3000)
                // Create an audio instance to play the file
                let audio = new Audio()
                // Set the sound file to play
                audio.src = this.soundBase + sound + ".mp3"
                // Set the volume of the sound
                audio.volume = parseFloat(sessionStorage.getItem('soundVolume'))
                // Load the audio instance with the sound file
                audio.load();
                // Play it.
                audio.play();
            }
        }
    }

    // This function plays a sound when the user clicks on a button.
    hackSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true') {
            let index =  Math.floor(Math.random() * this.hackSoundsArray.length);
            // Create an audio instance to play the file
            let audio = new Audio()
            // Set the sound file to play
            audio.src = this.soundBase + this.hackSoundsArray[index] + ".mp3"
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
            this.soundVolumeImg = this.volumeBase + changedVolume + ".png";
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
            this.soundVolumeImg = this.volumeBase + changedVolume + ".png";
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
            this.musicVolumeImg = this.volumeBase  + changedVolume + ".png";
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
            this.musicVolumeImg = this.volumeBase  + changedVolume + ".png";
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
            if (this.currentSong == this.soundBase + "songs/theme.mp3"){
                // Say in the console that it's already playing
                console.log("Song already playing")
            }
            // If the Main Theme is not playing
            else {
                // Set the currentSong in storage to "Theme" 
                sessionStorage.setItem("currentSong", "Theme")
                // Change the current song
                this.currentSong = this.soundBase + "songs/theme.mp3"
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
                console.log("Song already playing")
            if (this.currentSong == this.soundBase + "songs/outbreak.mp3"){
                // Say in console that it's already playing
                console.log("Song already playing")
            }
            // If "Outbreak" is not playing
            else {
                // Set the currentSong in storage to "Outbreak"
                sessionStorage.setItem("currentSong", "Outbreak")
                // Change the current song
                this.currentSong = this.soundBase + "songs/outbreak.mp3"
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
                this.currentSong = this.soundBase + "songs/theme.mp3"
            }
            // If the song "Outbreak" was selected
            else if (sessionStorage.getItem("currentSong") == "Outbreak"){
                // Change the current song to the Outbreak song
                this.currentSong = this.soundBase + "songs/outbreak.mp3"
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
            this.currentSong = this.soundBase + "songs/outbreak.mp3"
        }
    }

}
