import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ApiService } from './ApiService';
let PageRegisterComponent = class PageRegisterComponent {
    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(http) {
        this.http = http;
        // Hard-code credentials for convenience.
        this.username = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.password = '';
        this.passwordConfirmation = '';
        this.token = '';
        this.message = '';
        this.secureData = '';
        this.managerData = '';
        this.reqInfo = null;
        this.msgFromServer = '';
        this.site = 'http://localhost:1337/';
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
            this.message = "Registration successful. Please login.";
            // if(data["token"]  != null)  {
            //     this.token = data["token"]     
            //     sessionStorage.setItem('auth_token', data["token"]);
            //     this.message = "The user has been logged in."  
            // }    
        }
        // An error occurred. Data is not received. 
        );
    }
};
PageRegisterComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './page-register.html'
    })
], PageRegisterComponent);
export { PageRegisterComponent };
//# sourceMappingURL=app.page-register.js.map