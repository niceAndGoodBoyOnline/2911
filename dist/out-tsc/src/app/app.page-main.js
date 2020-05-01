import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ApiService } from './ApiService';
let PageMainComponent = class PageMainComponent {
    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(http, router) {
        this.http = http;
        this.router = router;
        // Hard-code credentials for convenience.
        this.message = '';
        this.secureData = '';
        this.managerData = '';
        this.reqInfo = null;
        this.msgFromServer = '';
        this.site = 'http://localhost:1337/';
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.checkLoggedIn();
        this.getBitcoin();
        this.getItems();
        this.getUserItemArray();
    }
    checkLoggedIn() {
        if (sessionStorage.getItem('username') == null) {
            this.router.navigate(['page-login']);
        }
    }
    getBitcoin() {
        let url = this.site + 'user/getBitcoin';
        this.http.post(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe((data) => {
            this.bitcoin = data;
        });
    }
    getUserItemArray() {
        let url = this.site + 'user/getItemArray';
        this.http.post(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe((data) => {
            console.log(data);
            this.userItemArray = data;
            this.calculateTotalPower();
        });
    }
    getItems() {
        let url = this.site + 'Game/getItems';
        this.http.get(url)
            .subscribe((data) => {
            let array = [];
            for (let i = 0; i < data.length; i++) {
                array.push(data[i].power);
            }
            this.itemArray = array;
        });
    }
    calculateTotalPower() {
        this.totalPower = 0;
        for (let i = 0; i < this.userItemArray.length; i++) {
            this.totalPower += this.userItemArray[i] * this.itemArray[i];
        }
    }
    increaseBitcoin() {
        this.bitcoin += 1 + this.totalPower;
    }
    openShop() {
        this.saveProgress();
        this.router.navigate(['page-shop']);
    }
    saveProgress() {
        let url = this.site + 'user/saveProgress';
        this.http.post(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe((data) => {
            this.message = data;
        });
    }
};
PageMainComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './page-main.html'
    })
], PageMainComponent);
export { PageMainComponent };
//# sourceMappingURL=app.page-main.js.map