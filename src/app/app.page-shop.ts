import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';
import { soundService } from './services/sound.service';

@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-shop.html',
  styleUrls: ['./app.page-shop.css', './app.page-main.settings.css']
})
export class PageShopComponent {
    // Variables we're gonna use in this page
    username              = '';
    
    token                 = '';
    message               = '';
    _apiService:ApiService;
    site: string;
    sound;
    path: any

    itemArray:any
    pricedItemArray:any
    userItemArray:any
    discount: number
    bitcoin: number
    overlayImg = 'assets/images/gui/vhs.gif'

    // This constructor is basically "do these things when the page is being loaded"
    constructor(private http: HttpClient, private router:Router, pathService: pathService, soundService: soundService) {
        this._apiService = new ApiService(http, this,pathService);
        this.site = pathService.path;
        this.sound = soundService
        this.setup()
    }

    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.getUserCommandArray()
        await this.getBitcoin()
        this.sound.setupSound();
        console.log("-----------------------------------SHOP PAGE SETUP -----------------------------------------")
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
                    this.getUserPrestigeItems(userCommandArray)
                } )
    }

    async getUserPrestigeItems(userCommandArray){
        let url = this.site + 'user/getUserPrestigeItems'
        return this.http.post<any>(url, {
            email: sessionStorage.getItem('email')
        })
            .subscribe(
                (data) => {
                    let userPrestigeItems = data
                    console.log('userPrestigeItems: ', data)
                    this.getPrestigeDiscount(userPrestigeItems, userCommandArray)
                }
            )
    }

    async getPrestigeDiscount(userPrestigeItems, userCommandArray) {
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                (data) => {
                    console.log('all prestige items: ', data)
                    this.calculateDiscount(userPrestigeItems, userCommandArray, data)
                } )
    }

    async calculateDiscount(userPrestigeItems, userCommandArray, prestigeItems) {
        let discount = 0
        discount = userPrestigeItems[1] * prestigeItems[1].power
        if(discount >= 0.9){
            discount = 0.9
        }
        this.discount = discount
        console.log('discount: ', discount)
        this.getItems(discount, userCommandArray)
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
                } )
    }

    // Get all the items in the database
    async getItems(discount, userCommandArray) {
        let itemPriceArray = []
        // Locate which approrpiate controller function to use. In this case, we use getItems function in GameController.js
        // You can find this out in router.js
        let url = this.site + 'Game/getItems'
        this.http.get<any>(url)
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (For debugging purposes).
                    console.log('all items: ', data)
                    for(let i=0;i<data.length;i++){
                        if(data[i].item == "botnet (Auto)"){
                            if(!(userCommandArray.includes("botnet"))){
                                data[i].item = "???"
                                data[i].price = "???"
                                data[i].power = "???"
                                data[i].desc = "Encrpyted."
                                continue
                            }
                        }
                        itemPriceArray.push(data[i].price)
                    }
                    console.log('updated', data)
                    this.itemArray = itemPriceArray
                    this.getUserItemArray(data, discount)
                } )
    }

    // Get the quantity of items the user bought from the database
    async getUserItemArray(itemArray, discount){
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
                    this.userItemArray = data
                    console.log('userItemArray: ', data)
                    // use that variable as parameter to getItems function
                    this.calculateFinalPrices(itemArray, discount, userItemArray)
                } )
    }

    async calculateFinalPrices(itemArray, discount, userItemArray){
        for(let i=0;i<itemArray.length;i++){
            if(userItemArray[i] == 0){
                if(!(itemArray[i].item == "???" )){
                    itemArray[i].price -= (itemArray[i].price * discount)
                }
                continue
            } else {
                // let subtotal = (Math.pow(this.itemArray[i], this.userItemArray[i]))
                // let subtotal = Math.round(Math.round(itemArray[i].price * ((Math.pow(1.1, userItemArray[i]) * (Math.pow(1.1, 1) - 1))) / (1.1 - 1)))
                let subtotal = Math.round(itemArray[i].price * Math.pow(1.05, userItemArray[i]))
                itemArray[i].price = subtotal - (subtotal * discount)

            }
        }
        this.pricedItemArray = itemArray
        console.log('pricedItemArray: ', itemArray)
    }

    // Buy. This function is called whenver user buys something. In the parameters, name is the item name and price is the item price.
    buy(name, price, quantity) {
        quantity = parseInt(quantity)
        // If user doesnt have enough bitcoins,
        if(this.bitcoin < (price * quantity)){
            // let em know.
            this.message = "You don't have enough bitcoin!"
        }
        // If user DOES have enough bitcoin,
        else {
            // Deduct bitcoin from item price (Visually only).
            this.bitcoin -= (Math.round(price) * quantity)
            // Thank the user
            this.message = "Thank you come again!"
            // Call make_transaction function with the item name
            this.make_transaction(name, quantity)
            // Save progress (This is so that bitcoins are officially deducted).
            this.saveProgress()
        }
    }


    // This function is to increase the user's quantity of the item
    make_transaction(name, quantity){
        // Locate whic appropriate controller function to use. In this case, we use makeTransaction function in UserController.js
        // You can tell how by looking in router.js
        let url = this.site + 'user/makeTransaction'
        // Send a POST request with email and item name data.
        // In UserController.js, this data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            name: name,
            quantity: quantity
        })
            .subscribe(
                // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
                // If data is recieved,
                (data) => {
                    // console log the data (for debugging purposes)
                    console.log(data)
                    this.userItemArray = data
                    this.update_price(name, data)
                }
            )
    }

    
    update_price(name, data) {
        for(let i=0;i<this.itemArray.length;i++){
            if(this.pricedItemArray[i].item == name){
                // let subtotal = (this.itemArray[i] * quantity) * 5
                // let subtotal = Math.round(Math.round(this.pricedItemArray[i].price * ((Math.pow(1.1, quantity) * (Math.pow(1.1, 1) - 1))) / (1.1 - 1)))
                // let subtotal = Math.round(this.itemArray[i] * Math.pow(1.05, this.userItemArray[i]))
                let subtotal = Math.round(this.itemArray[i] * Math.pow(1.05, data[i]))
                this.pricedItemArray[i].price = subtotal - (subtotal * this.discount)
                console.log('new price: ', this.pricedItemArray[i].price)
            }
        }
    }

    // Save progress
    saveProgress() {
        // Locate which appropriate controller function to use. In this case, we use saveProgress function in UserController.js
        // You can tell how by looking in router.js
        let url = this.site + 'user/saveProgress'
        // Send a POST request with email and bitcoin data.
        // In UserController.js, this data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
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
    