import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';
import { soundService } from './services/sound.service';
@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-prestige.html',
  styleUrls: ['./app.page-prestige.css', './app.page-main.settings.css']
})
export class PagePrestigeComponent {
    // Variables we're gonna use in this page
    username              = '';
    
    token                 = '';
    message               = '';
    specialMessage = '';
    _apiService:ApiService;
    site: string;
    sound;
    overlay = 'assets/images/gui/falling.gif'

    prestigeArray:any
    bitcoin: number
    prestigePoints: number

    purchaseablePrestige: number = 0
    nextPrestige: number = 0


    // This constructor is basically "do these things when the page is being loaded"
    constructor(private http: HttpClient, private router:Router, pathService: pathService,soundService: soundService) {
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.sound = soundService;
        this.setup()
    }

    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.getUserPrestigeItems()
        await this.getPrestigePoints()
        await this.getBitcoin()
        this.sound.setupSound()
        console.log("-----------------------------------PRESTIGE PAGE SETUP -----------------------------------------")
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
                    console.log('bitcoin: ', data)
                    this.calculatePrestigePoints()
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
                    console.log('prestige points: ', data)
                    this.prestigePoints = data
                } )
    }

    async getUserPrestigeItems(){
        let url = this.site + 'user/getUserPrestigeItems'
        this.http.post<any>(url, {
            email: sessionStorage.getItem('email')
        })
            .subscribe(
                (data) => {
                    console.log('userprestigeitems: ', data)
                    this.getPrestigeItems(data)
                }
            )
    }

    // Get all the prestige items in the database
    getPrestigeItems(userPrestigeItems) {
        // Locate which approrpiate controller function to use. In this case, we use getPrestigeItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (For debugging purposes).
                    console.log('all prestige items: ', data)
                    this.prestigeArray = data
                    for(let i=0;i<data.length;i++){
                        if(data[i].item == "botnet (command)"){
                            if(userPrestigeItems[i] > 0){
                                data[i].price = 0
                                data[i].desc = 'Sold out.'
                            }
                            break
                        }
                    }
                } )
    }



    // Calculates how many prestige points you can buy with your current bitcoin
    // * This is all visual. The actual calculations are in the user repo.
    calculatePrestigePoints() {
        // Set the variable for the initial cost for a prestige point
        let prestigeCost = 10000
        // Set the variable for how many prestige points you can buy
        this.purchaseablePrestige = 0
        // If you have more bitcoins than the prestige cost
        if (prestigeCost <= this.bitcoin){
            // Start a while loop while you have more bitcoins than the prestige cost
            while (prestigeCost <= this.bitcoin) {
                // Be able to buy an additional prestige point
                this.purchaseablePrestige += 1
                // Formula for calculating the next cost of a prestige point
                prestigeCost = Math.pow(prestigeCost, 1.1)
                // Have a flat cost for clarity
                prestigeCost = Math.floor(prestigeCost)
            }
        }
        // If the user cannot afford any prestige points
        else {
            // Say in the console that they cannot buy any
            console.log("Can't afford any prestige points :(")
        }
        // Set the cost for the next prestige point (for html)
        this.nextPrestige = prestigeCost
        console.log('cost of next prestige: ', prestigeCost)
        console.log('purchasable prestige: ', this.purchaseablePrestige)
    }

    buyPrestigePoint(){
        if(this.bitcoin < 10000){
            this.message = "You don't have enough bitcoin!"
        } else {
            this.bitcoin = 0
            this.purchaseablePrestige = 0
            this.nextPrestige = 0
            let url = this.site + "user/resetGainPrestige"
            this.http.post<any>(url, {
                email: sessionStorage.getItem("email"),
                prestigeArray: this.prestigeArray
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
                    if(data.includes('Command')){
                        this.message = data
                    }
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

    // Opens a modal for message when you attempt to purchase something from the shop
    // Not prefect, but sort of works :P
    openTempModal(){
        let modal = document.getElementById("purchaseModal")
        modal.style.display="block"

        var timeOutFunction = setTimeout(function(){
            modal.style.display="none"
            sessionStorage.setItem("modalOpen", "false")
        }, 2000)

        if (sessionStorage.getItem("modalOpen") != "true"){
            sessionStorage.setItem("modalOpen", "true")
        }
        else {
            clearTimeout(timeOutFunction)
        }
    }


}