import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnNavbarComponent } from './own-navbar.component';

describe('OwnNavbarComponent', () => {
  let component: OwnNavbarComponent;
  let fixture: ComponentFixture<OwnNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
