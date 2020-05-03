import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
    // Ready the information needed
    password              = '';         
    username              = '';
    
    token                 = '';
    message               = 'Not logged in.';
    reqInfo:any           = null;
    _apiService:ApiService;

    // Where the backend site is located
    public site='http://localhost:1337/';
    
    // Is the user logged in or not?
    loggedin = false;


    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.getToken();
        // COMMENT FUNCTION BELOW TO ALLOW UNIT TESTING
        this.startAutoBitcoin()
    }

    // Starts automatic bitcoin gain for all users
    startAutoBitcoin(){
        // Locate what appropriate controller to use in the backend
        // (This path refers to a path in router.js)
        let url = this.site + 'user/autoBitcoin'

        // Send a GET request to the above URL
        this.http.get<any>(url)
            .subscribe(

                // If data is recieved,
                (data) => {
                    console.log(data)
                } )
    }


    // Constantly checks if the user is logged in. Right now, this is
    // to update the links above the screen. (Main | Register | Login)
    updateLinks() {
        // If the user is logged out (if there is no data in the sessionStorage),
        if(sessionStorage.getItem("username")==null) {
            // let loggedin equal to false
            this.loggedin = false;
        }
        // otherwise,
        else {
            this.loggedin = true;
            // get the logged in user's username
            this.username = '(' + sessionStorage.getItem("username") + ')'
        }
    }
  
    // Assigns this.token to user's token if logged in. If logged out, clear it.
    getToken() {
        // Get the user's token
        if(sessionStorage.getItem('auth_token')!=null) {
            this.token   = sessionStorage.getItem('auth_token');
        }
        else {
            // Clear this.token if logged out
            this.token   = ''
        }
    }

    // Login
    login() {
        // Locate what appropriate controller to use in the backend
        // (This path refers to a path in router.js)
        let url = this.site + "auth";
    
        // This free online service receives post submissions.
        this.http.post(url, {
                username:  this.username,
                password:  this.password,
            })
        .subscribe( 
        // Data is received from the post request.
        (data) => {
            // console.log the recieved data (this is for debugging purposes)
            console.log(JSON.stringify(data));
            
            //if there is a token in the data recieved,
            if(data["token"]  != null)  {
                this.token = data["token"]
                // Set 'auth_token' in the session storage to the user's token
                sessionStorage.setItem('auth_token', data["token"]);
                this.message = "The user has been logged in."
            }
        },
        // An error occurred. Data is not received. 
        error => {
            alert(JSON.stringify(error));             
        });
    }

    // Log out, clear everything.
    logout() {
        sessionStorage.clear();
        this.getToken();

        // Clear data.
        this.reqInfo       = {};
        this.username = '';
        this.loggedin = false
    }
}
