import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChxTransferComponent } from './chx-transfer.component';

describe('ChxTransferComponent', () => {
  let component: ChxTransferComponent;
  let fixture: ComponentFixture<ChxTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChxTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChxTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
