import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapChxComponent } from './swap-chx.component';

describe('SwapChxComponent', () => {
  let component: SwapChxComponent;
  let fixture: ComponentFixture<SwapChxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapChxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapChxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
