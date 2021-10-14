import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetBridgeComponent } from './asset-bridge.component';

describe('AssetBridgeComponent', () => {
  let component: AssetBridgeComponent;
  let fixture: ComponentFixture<AssetBridgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetBridgeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetBridgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
