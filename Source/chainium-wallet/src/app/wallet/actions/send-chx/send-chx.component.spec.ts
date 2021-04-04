import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendChxComponent } from './send-chx.component';

describe('SendChxComponent', () => {
  let component: SendChxComponent;
  let fixture: ComponentFixture<SendChxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendChxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendChxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
