import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './services/ApiService';
import { Router } from '@angular/router';
import { pathService } from './services/path.service';
import { soundService } from './services/sound.service';

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
    autoBitcoin = "false"

    //pathBase
    guiBase = 'assets/images/gui/'
    settingsBase = 'assets/images/settings/'

    // Clickable stuff
    strongOn = 'strongOn.gif'
    strongOff = 'strongOff.gif'
    strongAnimation; 
    strongCD;
    strongImg = this.guiBase + this.strongOn;

    // UI stuff
    settingsState: boolean = false;
    settingsImg = this.settingsBase + 'Settings.png';
    osImgArray = ["os0p1.gif", "os1p1.gif", "os2p1.gif", "os3p1.gif", "os4p1.gif"]
    osState:boolean=false;
    guiState:boolean=false;
    osBase = "assets/images/os/";
    osImgPath = this.osBase + this.osImgArray[0]
    shopImg = this.guiBase + "shop.gif";
    prestigeImg = this.guiBase + "prestige.gif";
    imgState = "hidden"
   
    // networkmenu stuff
    networkSelectMenuState: boolean=false;
    networkSelectMenu = "netClose"
    networkStatus = this.guiBase + 'networks.gif'
    firewallArray;
    accessSoundState: boolean = true;

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
    cliImg = this.guiBase + 'error.gif'
    cliState = 'hidden'
    cliMessage;
    cliContainer; 

    site: string;
    sound;
    path;

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router: Router, pathService: pathService, soundService: soundService) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this, pathService);
        this.site = pathService.path;
        this.sound = soundService;
        this.setup()
        sessionStorage.setItem('inshop', 'false')
    }
    
    // Used when page is loaded up. Loads each function one at a time in order to fix potential
    // issues with functions relying on other functions finishing to work.
    async setup(){
        await this.checkLoggedIn()
        await this.getUserItemArray()
        await this.startAutosave()
        await this.getCommandArray()
        await this.getUserCommandArray()
        this.sound.setupSound()
        this.osShuffle()
        this.cliContainer = document.getElementById("cliContainer");
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
            this.cliContainer.style.height = 'auto';
            this.outputState = 'outputOpen'
    }

    closeTerminalOutput(){
        console.log("closing")
        this.cliContainer.style.height = '0';
        this.cliMessage = ''
        this.cliState = 'hidden';
        this.outputState = 'outputClosed'

    }


    // handles false returns on cli commands
    unknownCommand(command){
        this.cliImg = this.guiBase + 'error.gif'
        this.cliMessage = command + " is not a command you know. Use help command to see known commands."
        this.cliState = 'visible'
    }

    // recursive function to change the osImg randomly cause it looks cool
    osShuffle() {
        let rollNum = Math.floor(Math.random() * (this.osImgArray.length) );
        this.osImgPath = this.osBase + this.osImgArray[rollNum];
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
                    this.userCommandArray = data
                    // use that variable as parameter to getItems function
                    console.log('usercommandarray: ', userCommandArray)
                } )
    }

    async cli(command){
        // Locate what appropriate controller to use in the backend.
        // (This path refers to a path in router.js)
        if (command != ""){
            this.openTerminalOutput()
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
                            this.cliImg = this.guiBase + 'exec.gif'
                            eval(data.function)
                            this.cliState = 'visible'
                        }
                    })
        }
        else{
            this.closeTerminalOutput()
        }
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
        console.log(itemArray)
        console.log(userItemArray)
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
            this.accessSoundState = false;
            setTimeout(()=> {this.accessSoundState = true;}, 10000)
            // Instantiate an audio player to play the clicking sounds.
            let audio = new Audio()
            // Randomly pick which sound to play from this.audioArray array
            audio.src = this.sound.accessGranted
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
        if(this.autoBitcoin == "true"){
            return
        }
        this.autoBitcoin = "true"
            let autoClick = setInterval(() => {
                if((sessionStorage.getItem('auth_token') == null) || ((sessionStorage.getItem('inshop') != 'false'))){
                    clearInterval(autoClick)
                    sessionStorage.setItem('autoClick', 'false')
                    return
                }
                this.bitcoin += this.autoClickPower
                console.log('yes')
            }, 100)
        }


    increaseTempPower() {
        this.tempPowerIncrease += 1
        this.totalClickPower = ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease
        setTimeout(() => {
            this.tempPowerIncrease -= 1
            this.totalClickPower = ((1 + this.totalPower) * this.prestigeMultiplier) * this.tempPowerIncrease
        }, 10000)
    }

    // STRONG TIME! Have a strong time with a strong zero. 0 calories, 9% alcohol.
    strongManager(){
        // if the image IS NOT the "available" image
        if (this.strongImg != this.guiBase + this.strongOn){
            console.log('strong not available')
            this.sound.clickSound('errorSound')
            this.strongAnimation = 'shakeAnimation'
            setTimeout(()=> {this.strongAnimation = ""}, 1000)
            // play error sound, maybe shake the can with css
        }
        // if this image IS the "available" image
        else if (this.strongImg == this.guiBase + this.strongOn){
            this.sound.clickSound('strongSound')
            this.strongImg = this.guiBase + this.strongOff;
            setTimeout(()=>{this.strongImg = this.guiBase + this.strongOn;}, 10000)
            this.increaseTempPower()
        }
    }

    // Function to open settings modal
    toggleSettings(){
        // Get the modal through the id
        var modal = document.getElementById("settingsBox");
        console.log(modal)
        if (this.settingsState == false){
            this.settingsState = true;
            this.settingsImg = this.guiBase + 'close.gif'
            // Change css of modal to display it
            modal.style.display = "block"
        }
        else if (this.settingsState == true){
            this.settingsState = false;
            this.settingsImg = this.settingsBase + 'Settings.png'
            modal.style.display = "none"
        }
        }

    // Function to close settings modal
    closeSettings(){
        // Get the modal through the id
        var modal = document.getElementById("settingsBox");
        // Change css of modal to be unable to see it
        modal.style.display = "none"
        }    
}