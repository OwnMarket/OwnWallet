import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransferComponent } from './asset-transfer.component';

describe('AssetTransferComponent', () => {
  let component: AssetTransferComponent;
  let fixture: ComponentFixture<AssetTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
