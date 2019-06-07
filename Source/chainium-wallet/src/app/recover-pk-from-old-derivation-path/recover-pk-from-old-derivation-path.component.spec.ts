import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPkFromOldDerivationPathComponent } from './recover-pk-from-old-derivation-path.component';

describe('RecoverPkFromOldDerivationPathComponent', () => {
  let component: RecoverPkFromOldDerivationPathComponent;
  let fixture: ComponentFixture<RecoverPkFromOldDerivationPathComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoverPkFromOldDerivationPathComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverPkFromOldDerivationPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
