import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';
@Component({
  selector: 'app-root',
  // Assign which html page to this component.
  templateUrl: './app.page-shop.html',
  styleUrls: ['./app.page-shop.css']
})
export class PageShopComponent {
    // Variables we're gonna use in this page
    username              = '';
    
    token                 = '';
    message               = '';
    _apiService:ApiService;
    public site: string;
    path: any

    itemArray:any
    pricedItemArray:any
    userItemArray:any
    discount: number
    bitcoin: number

    soundImg: string = "assets/images/SoundOn.png";
    musicImg: string = "assets/images/musicOn.png"
    musicPlayer = <HTMLAudioElement>document.getElementById("musicPlayer")
    currentSong: string = "assets/sounds/songs/theme.mp3";
    hoverSoundFile = 'assets/sounds/HoverSound.mp3'
    clickSoundFile = 'assets/sounds/ClickSound.mp3'
    

    // This constructor is basically "do these things when the page is being loaded"
    constructor(private http: HttpClient, private router:Router, pathService: pathService) {
        this._apiService = new ApiService(http, this,pathService);
        this.site = pathService.path;
        this.musicPlayer.loop = true;
        this.musicPlayer.volume = 0.5;
        this.setup()
    }

    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.getUserPrestigeItems()
        await this.getBitcoin()
        await this.setSound()
        await this.setMusic()
        console.log("Setup Complete!")
    }

    async getUserPrestigeItems(){
        let url = this.site + 'user/getUserPrestigeItems'
        return this.http.post<any>(url, {
            email: sessionStorage.getItem('email')
        })
            .subscribe(
                (data) => {
                    let userPrestigeItems = data
                    this.getPrestigeDiscount(userPrestigeItems)
                }
            )
    }

    async getPrestigeDiscount(userPrestigeItems) {
        let url = this.site + 'Game/getPrestigeItems'
        this.http.get<any>(url)
            .subscribe(
                (data) => {
                    console.log(JSON.stringify(data))
                    this.calculateDiscount(userPrestigeItems, data)
                } )
    }

    async calculateDiscount(userPrestigeItems, prestigeItems) {
        let discount = 0
        discount = userPrestigeItems[1] * prestigeItems[1].power
        this.discount = discount
        this.getItems(discount)
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

    // Get all the items in the database
    async getItems(discount) {
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
                    console.log(JSON.stringify(data))
                    for(let i=0;i<data.length;i++){
                        itemPriceArray.push(data[i].price)
                    }
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
                    // use that variable as parameter to getItems function
                    this.calculateFinalPrices(itemArray, discount, userItemArray)
                } )
    }

    async calculateFinalPrices(itemArray, discount, userItemArray){
        for(let i=0;i<itemArray.length;i++){
            if(userItemArray[i] == 0){
                itemArray[i].price -= (itemArray[i].price * discount)
                continue
            } else {
                // let subtotal = (Math.pow(this.itemArray[i], this.userItemArray[i]))
                let subtotal = Math.round(Math.round(itemArray[i].price * ((Math.pow(1.4, userItemArray[i]) * (Math.pow(1.4, 1) - 1))) / (1.4 - 1)))
                itemArray[i].price = subtotal - (subtotal * discount)

            }
        }
        this.pricedItemArray = itemArray
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
            this.update_price(name, quantity)
        }
    }

    update_price(name, quantity ) {
        for(let i=0;i<this.itemArray.length;i++){
            if(this.pricedItemArray[i].item == name){
                // let subtotal = (this.itemArray[i] * quantity) * 5
                let subtotal = Math.round(Math.round(this.pricedItemArray[i].price * ((Math.pow(1.4, quantity) * (Math.pow(1.4, 1) - 1))) / (1.4 - 1)))
                this.pricedItemArray[i].price = subtotal - (subtotal * this.discount)
            }
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
                }
            )
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
            // Load the audio instance with the sound file
            audio.load();
            // Play it.
            audio.play();
        }
    }

}
    