import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnIconComponent } from './own-icon.component';

describe('OwnIconComponent', () => {
  let component: OwnIconComponent;
  let fixture: ComponentFixture<OwnIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
