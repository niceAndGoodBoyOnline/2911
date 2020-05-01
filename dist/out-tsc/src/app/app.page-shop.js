import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ApiService } from './ApiService';
let PageShopComponent = class PageShopComponent {
    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(http, router) {
        this.http = http;
        this.router = router;
        // Hard-code credentials for convenience.
        this.password = '';
        this.username = '';
        this.token = '';
        this.message = '';
        this.secureData = '';
        this.managerData = '';
        this.reqInfo = null;
        this.msgFromServer = '';
        this.site = 'http://localhost:1337/';
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.getItems();
        this.getBitcoin();
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
    getItems() {
        let url = this.site + 'Game/getItems';
        this.http.get(url)
            .subscribe((data) => {
            console.log(JSON.stringify(data));
            console.log(data);
            this.itemArray = data;
        });
    }
    buy(name, price) {
        if (this.bitcoin < price) {
            this.message = "You don't have enough bitcoin!";
        }
        else {
            this.bitcoin -= price;
            this.message = "Thank you come again!";
            this.make_transaction(name);
            this.saveProgress();
        }
    }
    make_transaction(name) {
        let url = this.site + 'user/makeTransaction';
        this.http.post(url, {
            email: sessionStorage.getItem("email"),
            name: name
        })
            .subscribe((data) => {
            console.log(data);
        });
    }
    saveProgress() {
        let url = this.site + 'user/saveProgress';
        this.http.post(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe((data) => {
        });
    }
};
PageShopComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './page-shop.html'
    })
], PageShopComponent);
export { PageShopComponent };
//# sourceMappingURL=app.page-shop.js.map