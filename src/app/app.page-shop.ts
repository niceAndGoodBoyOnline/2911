import { Component  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './ApiService';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './page-shop.html'
})
export class PageShopComponent {
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

    itemArray:any
    bitcoin: number

    // Since we are using a provider above we can receive 
    // an instance through an constructor.
    constructor(private http: HttpClient, private router:Router) {
        // Pass in http module and pointer to AppComponent.
        this._apiService = new ApiService(http, this);
        this.getItems()
        this.getBitcoin()

    }

    getBitcoin() {
        let url = this.site + 'user/getBitcoin'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email")
        })
            .subscribe(
                (data) => {
                    this.bitcoin = data
                } )
    }

    getItems() {
        let url = this.site + 'Game/getItems'
        this.http.get<any>(url)
            .subscribe(
                (data) => {
                    console.log(JSON.stringify(data))
                    console.log(data)
                    this.itemArray = data
                } )
    }

    buy(name, price) {
        if(this.bitcoin < price){
            this.message = "You don't have enough bitcoin!"
        }
        else {
            this.bitcoin -= price
            this.message = "Thank you come again!"
            this.make_transaction(name)
            this.saveProgress()
        }
    }

    make_transaction(name){
        let url = this.site + 'user/makeTransaction'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            name: name
        })
            .subscribe(
                (data) => {
                    console.log(data)
                }
            )
    }

    saveProgress() {
        let url = this.site + 'user/saveProgress'
        this.http.post<any>(url, {
            email: sessionStorage.getItem("email"),
            bitcoin: this.bitcoin
        })
            .subscribe(
                (data) => {
                    console.log(data)
                } )
    }


}