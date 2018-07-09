import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressAccountInfoComponent } from './address-account-info.component';

describe('AddressAccountInfoComponent', () => {
  let component: AddressAccountInfoComponent;
  let fixture: ComponentFixture<AddressAccountInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressAccountInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
