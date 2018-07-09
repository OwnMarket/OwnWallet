import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAccountComponent } from './generate-account.component';

describe('GenerateAccountComponent', () => {
  let component: GenerateAccountComponent;
  let fixture: ComponentFixture<GenerateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
