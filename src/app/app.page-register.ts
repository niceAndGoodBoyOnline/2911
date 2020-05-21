import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';
import { soundService } from './services/sound.service';

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
    site:string;
    sound;
    path;
    
    // for osImg animation
    osImgPath: string = "";
    osImgArray = ["os0p1.gif", "os1p1.gif", "os2p1.gif", "os3p1.gif", "os4p1.gif"]
   

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, pathService: pathService, private router: Router, soundService: soundService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.titleShuffle()
        this.sound = soundService;
        this.setup()
    }

    async setup() {
        await this.getItems()
        await this.getPrestigeItems()
        await this.getCommandArray()
        this.sound.setupSound()
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

        this.osImgPath = "assets/images/os/" + this.osImgArray[rollNum];
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
            if(data["errorMessage"]){
                this.message = data["errorMessage"]
            }
            if(data["message"] == "Registration successful. Please login."){
                console.log('Navigating...')
                this.router.navigate(['/page-login'])
            }
            }
        )
    }
}