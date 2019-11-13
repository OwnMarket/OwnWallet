import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorManagmentComponent } from './validator-managment.component';

describe('ValidatorManagmentComponent', () => {
  let component: ValidatorManagmentComponent;
  let fixture: ComponentFixture<ValidatorManagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorManagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
