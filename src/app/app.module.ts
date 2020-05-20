import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }      from '@angular/forms';
import { AppComponent } from './app.component';
import { PageMainComponent } from './app.page-main';
import { PageRegisterComponent } from './app.page-register';
import { PageLoginComponent } from './app.page-login';
import { PageShopComponent } from './app.page-shop'
import { PagePrestigeComponent } from './app.page-prestige'
import { routing } from './app.routing';
import { AngularDraggableModule } from 'angular2-draggable';
import { pathService } from './services/path.service';
import { soundService } from './services/sound.service';

@NgModule({
  declarations: [
    AppComponent, PageMainComponent, PageRegisterComponent, PageLoginComponent,
    PageShopComponent, PagePrestigeComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, routing, AngularDraggableModule],
  providers: [pathService, soundService],
  bootstrap: [AppComponent]
})
export class AppModule { }
