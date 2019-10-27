import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnCardComponent } from './own-card.component';

describe('OwnCardComponent', () => {
  let component: OwnCardComponent;
  let fixture: ComponentFixture<OwnCardComponent>;

  beforeEach(async(() => {
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
