import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnDropdownItemComponent } from './own-dropdown-item.component';

describe('OwnDropdownItemComponent', () => {
  let component: OwnDropdownItemComponent;
  let fixture: ComponentFixture<OwnDropdownItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnDropdownItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnDropdownItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
