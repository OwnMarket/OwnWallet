import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnSliderComponent } from './own-slider.component';

describe('OwnSliderComponent', () => {
  let component: OwnSliderComponent;
  let fixture: ComponentFixture<OwnSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
