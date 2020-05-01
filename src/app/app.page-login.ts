import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './page-login.html'
})
export class PageLoginComponent {
    // Hard-code credentials for convenience.
    password              = '';         
    username              = '';
    
    token                 = '';
    message               = '';
    secureData:string     = '';
    managerData:string    = '';
    reqInfo:any           = null;
    msgFromServer:string  = '';
    _apiService:ApiService;
    public site='http://localhost:1337/';

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router:Router) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);

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
        (data) => {
            // Inspect the data to know how to parse it.
            console.log(JSON.stringify(data));
            if(data["token"]  != null)  {
                this.token = data["token"]     
                sessionStorage.setItem('auth_token', data["token"]);
                sessionStorage.setItem('username', data["username"]);
                sessionStorage.setItem('email', data['email']);
                this.message = "The user has been logged in."
                this.router.navigate([''])

                
                // sessionStorage.setItem('roles', JSON.stringify(data["roles"]))
            }    
        },
        // An error occurred. Data is not received. 
        error => {
            alert(JSON.stringify(error));             
        });
    }

}