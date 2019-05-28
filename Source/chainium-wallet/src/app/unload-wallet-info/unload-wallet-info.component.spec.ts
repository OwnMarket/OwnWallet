import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnloadWalletInfoComponent } from './unload-wallet-info.component';

describe('UnloadWalletInfoComponent', () => {
  let component: UnloadWalletInfoComponent;
  let fixture: ComponentFixture<UnloadWalletInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnloadWalletInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnloadWalletInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
