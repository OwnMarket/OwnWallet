import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnCardComponent } from './own-card.component';

describe('OwnCardComponent', () => {
  let component: OwnCardComponent;
  let fixture: ComponentFixture<OwnCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
