import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnSlideComponent } from './own-slide.component';

describe('OwnSlideComponent', () => {
  let component: OwnSlideComponent;
  let fixture: ComponentFixture<OwnSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
