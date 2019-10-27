import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnCardBodyComponent } from './own-card-body.component';

describe('OwnCardBodyComponent', () => {
  let component: OwnCardBodyComponent;
  let fixture: ComponentFixture<OwnCardBodyComponent>;

  beforeEach(async(() => {
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
