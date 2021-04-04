import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddressInfoComponent } from './address-info.component';

describe('AddressInfoComponent', () => {
  let component: AddressInfoComponent;
  let fixture: ComponentFixture<AddressInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
