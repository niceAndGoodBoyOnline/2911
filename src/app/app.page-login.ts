import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
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
    osImgArray = ["os0p1.gif", "os1p1.gif", "os2p1.gif", "os3p1.gif","os4p1.gif"]

    public site='http://localhost:1337/';

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router:Router) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.titleShuffle()
    }

    titleShuffle() {
        let rollNum = Math.floor(Math.random() * (this.osImgArray.length) );

        console.log("shuffle ON")
        console.log(this.osImgArray[rollNum])

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
                this.message = "The user has been logged in."
                // When logged in successfully, take user to main page
                this.router.navigate([''])


            }    
        },
        // An error occurred. Data is not received. 
        error => {
            alert(JSON.stringify(error));             
        });
    }

}