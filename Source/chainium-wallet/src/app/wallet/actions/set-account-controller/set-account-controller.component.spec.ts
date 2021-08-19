import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAccountControllerComponent } from './set-account-controller.component';

describe('SetAccountControllerComponent', () => {
  let component: SetAccountControllerComponent;
  let fixture: ComponentFixture<SetAccountControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetAccountControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAccountControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
