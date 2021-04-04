import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnCardBodyComponent } from './own-card-body.component';

describe('OwnCardBodyComponent', () => {
  let component: OwnCardBodyComponent;
  let fixture: ComponentFixture<OwnCardBodyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnCardBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnCardBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
