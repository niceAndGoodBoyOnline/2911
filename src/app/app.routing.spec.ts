
import { Location } from "@angular/common";
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Router } from "@angular/router";
import { PageMainComponent }        from './app.page-main';
import { PageRegisterComponent } from './app.page-register';
import { PageLoginComponent } from './app.page-login';
import { PageShopComponent } from './app.page-shop';
import { AppComponent }          from './app.component';
import { appRoutes } from "./app.routing";
import { HttpClientModule } from '@angular/common/http';
import { pathService } from './services/path.service';

describe("Router: App", () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(appRoutes), HttpClientModule],
      declarations: [PageMainComponent, PageRegisterComponent, PageLoginComponent,
        PageShopComponent],
        providers:[pathService]
    });

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(AppComponent);
    router.initialNavigation();
  });

  it("fakeAsync works", fakeAsync(() => {
    let promise = new Promise(resolve => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
  }));

  it('navigate to "" redirects you to /page-login, assuming logged out', fakeAsync(() => {
    router.navigate([""]).then(() => {
      tick(50);
      expect(location.path()).toBe("/page-login");
    });
  }));

  it('navigate to "page-login" takes you to /page-login', fakeAsync(() => {
    router.navigate(["/page-login"]).then(() => {
      tick(50);
      expect(location.path()).toBe("/page-login");
    });
  }));

  it('navigate to "page-register" takes you to /page-register', fakeAsync(() => {
    router.navigate(["/page-register"]).then(() => {
      tick(50);
      expect(location.path()).toBe("/page-register");
    });
  }));

  it('navigate to "page-shop" takes you to /page-login, assuming logged out', fakeAsync(() => {
    router.navigate(["/page-shop"]).then(() => {
      tick(50);
      expect(location.path()).toBe("/page-login");
    });
  }));
});