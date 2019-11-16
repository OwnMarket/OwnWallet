import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnModalComponent } from './own-modal.component';

describe('OwnModalComponent', () => {
  let component: OwnModalComponent;
  let fixture: ComponentFixture<OwnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
