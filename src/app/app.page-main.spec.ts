import { TestBed, async } from '@angular/core/testing';
import { PageMainComponent } from './app.page-main';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageMainComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule],
      declarations: [
        PageMainComponent
      ],
    }).compileComponents();
  }));

  it('bitcoin value should not be null or NaN', () => {
    const fixture = TestBed.createComponent(PageMainComponent);
    const app = fixture.componentInstance;
    expect(app.bitcoin).not.toBeNull();
    expect(app.bitcoin).toBeDefined();
  });

  // it('itemArray should not be empty', () => {
  //   const fixture = TestBed.createComponent(PageMainComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.itemArray).not.toBeNull();
  //   expect(app.itemArray).toBeDefined();
  // });

  // it('useritemArray should not be empty', () => {
  //   const fixture = TestBed.createComponent(PageMainComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.userItemArray).not.toBeNull();
  //   expect(app.userItemArray).toBeDefined();
  // });

  it('totalPower should be calculated and not be undefined', () => {
    const fixture = TestBed.createComponent(PageMainComponent);
    const app = fixture.componentInstance;
    expect(app.totalPower).not.toBeNull();
    expect(app.totalPower).toBeDefined();
  })

});
