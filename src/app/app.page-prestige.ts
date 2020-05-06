import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './page-prestige.html',
  styleUrls: ['./page-prestige.css']
})
export class PagePrestigeComponent {
    // Variables we're gonna use in this page
    username              = '';
    
    token                 = '';
    message               = '';
    _apiService:ApiService;
    public site='http://localhost:1337/';

    prestigeArray:any
    bitcoin: number
    prestigePoints: number

    // This constructor is basically "do these things when the page is being loaded"
    constructor(private http: HttpClient, private router:Router) {
        this._apiService = new ApiService(http, this);
        this.setup()
    }

    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.getPrestigeItems()
        await this.getPrestigePoints()
        await this.getBitcoin()
        await this.setSound()
        console.log("Setup Complete!")
    }

    // Get user's bitcoin from the database
    getBitcoin() {
        // Set variable 'inshop' in session storage to 'true'. This is used to tell the autosave that the user is in the shop and should not be auto saving.
        sessionStorage.setItem('inshop', 'true')
        // Locate which appropriate controller function to use. In this case, we use getBitcoin function in UserController.js
        // You can find this out in router.js
        let url = this.site + 'user/getBitcoin'
        // Send a POST request with email data.
        // In UserController.js, this email data is recieved by "req.body.email"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    this.bitcoin = data
                } )
    }

    // Get user's prestige points from the database
    getPrestigePoints() {
        // Set variable 'inshop' in session storage to 'true'. This is used to tell the autosave that the user is in the shop and should not be auto saving.
        sessionStorage.setItem('inshop', 'true')
        // Locate which appropriate controller function to use. In this case, we use getPrestigePoints function in UserController.js
        // You can find this out in router.js
        let url = this.site + 'user/getPrestigePoints'
        // Send a POST request with email data.
        // In UserController.js, this email data is recieved by "req.body.email"
        // This is how we get data from frontend(Angular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    this.prestigePoints = data
                } )
    }

    // Get all the prestige items in the database
    getPrestigeItems() {
        // Locate which approrpiate controller function to use. In this case, we use getPrestigeItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (For debugging purposes).
                    console.log(JSON.stringify(data))
                    this.prestigeArray = data
                } )
    }

    buyPrestigePoint(){
        if(this.bitcoin < 10){
            this.message = "You don't have enough bitcoin!"
        } else {
            this.bitcoin = 0
            let url = this.site + "user/resetGainPrestige"
            this.http.post<any>(url, {
                email: sessionStorage.getItem("email")
            })
            .subscribe(
                (data) => {
                    console.log(data)
                    this.getPrestigePoints()
                }
            )
        }
    }

    // Buy. This function is called whenver user buys something. In the parameters, name is the item name and price is the item price.
    buy(name, price) {
        // If user doesnt have enough bitcoins,
        if(this.prestigePoints < price){
            // let em know.
            this.message = "You don't have enough prestige points!"
        }
        // If user DOES have enough bitcoin,
        else {
            // Deduct bitcoin from item price (Visually only).
            this.prestigePoints -= price
            // Thank the user
            this.message = "Thank you come again!"
            // Call make_transaction function with the item name
            this.make_transaction(name)
        }
    }

    // This function is to increase the user's quantity of the item
    make_transaction(name){
        // Locate whic appropriate controller function to use. In this case, we use makeTransaction function in UserController.js
        // You can tell how by looking in router.js
        let url = this.site + 'user/makePrestigeTransaction'
        // Send a POST request with email and item name data.
        // In UserController.js, this data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            name: name
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (for debugging purposes)
                    console.log(data)
                    this.saveProgress()
                }
            )
    }

    // Save progress
    saveProgress() {
        // Locate which appropriate controller function to use. In this case, we use saveProgress function in UserController.js
        // You can tell how by looking in router.js
        let url = this.site + 'user/savePrestigeProgress'
        // Send a POST request with email and bitcoin data.
        // In UserController.js, this data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            prestigePoints: this.prestigePoints
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (for debugging purposes)
                    console.log(data)
                } )
    }

    // This function is called when the using comes to the main page. Changes image and sound
    // settings based on what they were the last time you entered the main page.
    async setSound() {
        // If sound is turned on
        if (sessionStorage.getItem('sound') == 'true'){
            // Keep sound on and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            (<HTMLImageElement>document.getElementById("sound")).src = "assets/images/SoundOn.png"
        }
        // If sound is turned off
        else if (sessionStorage.getItem('sound') == 'false'){
            // Keep sound off and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            (<HTMLImageElement>document.getElementById("sound")).src = "assets/images/SoundOff.png"
        }
        // If sound has not been set this session
        else {
            // Turn sound on
            sessionStorage.setItem('sound', 'true');
            (<HTMLImageElement>document.getElementById("sound")).src = "assets/images/SoundOn.png"
        }
    }

    // This function is called every time the user clicks on the sound icon to turn on/off the sound
    changeSound() {
        // If the session variable "sound" is set to "true"
        if (sessionStorage.getItem('sound') == 'true') {
            //Set the session variable "sound" to false and change the image accordingly
            sessionStorage.setItem('sound', 'false');
            (<HTMLImageElement>document.getElementById("sound")).src = "assets/images/SoundOff.png"
        }

        // If the session variable "sound" is set to "false"
        else if (sessionStorage.getItem('sound') == 'false') {
            //Set the session variable "sound" to true and change the image accordingly
            sessionStorage.setItem('sound', 'true');
            (<HTMLImageElement>document.getElementById("sound")).src = "assets/images/SoundOn.png"
        }
    }


}