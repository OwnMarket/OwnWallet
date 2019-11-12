import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveChxComponent } from './receive-chx.component';

describe('ReceiveChxComponent', () => {
  let component: ReceiveChxComponent;
  let fixture: ComponentFixture<ReceiveChxComponent>;

  beforeEach(async(() => {
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
