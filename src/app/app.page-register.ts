import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
@Component({
  selector: 'app-root',
  templateUrl: './page-register.html'
})
export class PageRegisterComponent {
    // Hard-code credentials for convenience.
    username = '';
    email = '';
    firstName = '';
    lastName = '';
    password = '';
    passwordConfirmation = '';

    
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
    constructor(private http: HttpClient) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);

    }

    register() {
        let url = this.site + "user/RegisterUser";
    
        // This free online service receives post submissions.
        this.http.post(url, {
                password: this.password,
                passwordConfirm: this.passwordConfirmation,
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                username: this.username
            })
        .subscribe( 
        // Data is received from the post request.
        (data) => {
            // Inspect the data to know how to parse it.
            console.log(JSON.stringify(data));
            this.message = "Registration successful. Please login."
            
            // if(data["token"]  != null)  {
            //     this.token = data["token"]     
            //     sessionStorage.setItem('auth_token', data["token"]);
            //     this.message = "The user has been logged in."  
            // }    
        }
        // An error occurred. Data is not received. 
        )
    }
}