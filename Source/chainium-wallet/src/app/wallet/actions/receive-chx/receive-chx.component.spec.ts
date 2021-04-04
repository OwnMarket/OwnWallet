import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReceiveChxComponent } from './receive-chx.component';

describe('ReceiveChxComponent', () => {
  let component: ReceiveChxComponent;
  let fixture: ComponentFixture<ReceiveChxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiveChxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveChxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
