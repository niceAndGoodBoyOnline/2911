import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
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

    
    token                 = '';
    message               = '';
    _apiService:ApiService;
    public site='/';

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);

    }

    register() {
        // Locate which appropriate controller function to use. In this case, we're using RegisterUser in UserController.js.
        // (You can find where this leads in router.js file.)
        let url = this.site + "user/RegisterUser";
    
        // Send a POST request with below data.
        // In UserController.js, this below data is recieved by "req.body.[whatever we want to grab]"
        // This is how we get data from frontend(Andular, files in "src/app" folder) to backend(Node.JS, controllers folder and data folder).
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
        // You can see and change what data is being received by looking at "res.json()" in the appropriate controller function.
        (data) => {
            // console log the recieved data (for debugging purposes)
            console.log(JSON.stringify(data));
            // let the user know what happened
            this.message = data["message"]
            }
        )
    }
}