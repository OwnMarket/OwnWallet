import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OwnDropdownMenuComponent } from './own-dropdown-menu.component';

describe('OwnDropdownMenuComponent', () => {
  let component: OwnDropdownMenuComponent;
  let fixture: ComponentFixture<OwnDropdownMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnDropdownMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnDropdownMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
