import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitTransactionInfoComponent } from './submit-transaction-info.component';

describe('SubmitTransactionInfoComponent', () => {
  let component: SubmitTransactionInfoComponent;
  let fixture: ComponentFixture<SubmitTransactionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitTransactionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitTransactionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
