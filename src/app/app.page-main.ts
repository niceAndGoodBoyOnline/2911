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
    // Hard-code credentials for convenience.
 
    message               = '';
    msgFromServer:string  = '';
    _apiService:ApiService;
    bitcoin: number
    totalPower: number

    //Sound stuff
    audioArray = ['assets/sounds/sfx1.mp3', 'assets/sounds/sfx2.mp3', 'assets/sounds/sfx3.mp3']
    sound: boolean = false;
    soundImg: string = "assets/images/SoundOn.png";
    songList: ["assets/sounds/songs/theme.mp3"];
    currentSong: string = "assets/sounds/songs/theme.mp3";
    musicPlayer = new Audio();


    // firewall stuff
    currentFirewall = "assets/images/firewalls/firewall25.gif"
    
    public site: string;
    path: any

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router: Router, pathService: pathService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.musicPlayer.loop = true;
        this.musicPlayer.volume = 0.5;
        this.setup()
        sessionStorage.setItem('inshop', 'false')
    }
    
    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.checkLoggedIn()
        await this.getBitcoin()
        await this.getUserItemArray()
        await this.startAutosave()
        await this.setSound()
        console.log("Setup Complete!")
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
                        array.push(data[i].power)
                    }
                    // Calculate the total power with the array we made and the array we have that was passed from getUserItemArray.
                    this.calculateTotalPower(array, userItemArray)
                } )
    }


    // Calculate total clicking power
    calculateTotalPower(itemArray, userItemArray) {
        // Make totalpower equal to zero (to make sure we dont re-add the power value)
        this.totalPower = 0
        // for each item in userItemArray
        for(let i=0;i < userItemArray.length;i++){
            // multiply the amount the user has of that item by the item's power, then add it to totalpower.
            // Math Formula: Sigma of items bought multiplied by item power
            this.totalPower += userItemArray[i] * itemArray[i]
        }
    }

    // This is how bitcoin is increased each click.
    increaseBitcoin() {
        // Default value is 1 bitcoin per click. Items increase total clicking power which also increases bitcoin gain.
        this.bitcoin += 1 + this.totalPower
        if (sessionStorage.getItem('sound') == 'true') {
            // Instantiate an audio player to play the clicking sounds.
            let audio = new Audio()
            // Randomly pick which sound to play from this.audioArray array
            audio.src = this.audioArray[Math.floor(Math.random() * this.audioArray.length)]
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
            this.changeSound()
        }
        // If sound is turned off
        else if (sessionStorage.getItem('sound') == 'false'){
            // Keep sound off and change the image accordingly
            sessionStorage.setItem('sound', 'false')
            this.changeSound()
        }
        // If sound has not been set this session
        else {
            // Turn sound on
            sessionStorage.setItem('sound', 'true')
            this.changeSound()
        }
    }

    // This function is called every time the user clicks on the sound icon to turn on/off the sound
    changeSound() {
        // If the session variable "sound" is set to "true"
        if (sessionStorage.getItem('sound') == 'true') {
            //Set the session variable "sound" to false and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            this.soundImg = "assets/images/SoundOff.png";
            this.musicPlayer.pause()
           
        }

        // If the session variable "sound" is set to "false"
        else if (sessionStorage.getItem('sound') == 'false') {
            //Set the session variable "sound" to true and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            this.soundImg = "assets/images/SoundOn.png";
            this.musicPlayer.src = this.currentSong;
            this.musicPlayer.load();
            this.musicPlayer.play();
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
        if(sessionStorage.getItem('save') == 'false'){
            sessionStorage.setItem('save', 'true')
            // Set how often the below code is executed.
            // Code below is the same thing as saveProgress()
            let interval = setInterval(() => {
                // If the user is logged out, or if user is in shop,
                if((sessionStorage.getItem('auth_token') == null) || ((sessionStorage.getItem('inshop') != 'false'))){
                    // Stop the autosave.
                    clearInterval(interval)
                    //console.log('Autosave has been stopped.')
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
            }, 3000)
        } else {
            // If there is an existing autosave instance, let em know in the console.
            //console.log('Automated saving is not allowed to be (re)activated at this time.')
        }
    }

}