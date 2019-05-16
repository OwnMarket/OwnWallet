import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OwnWalletComponent } from "./own-wallet.component";

describe("OwnWalletComponent", () => {

  let fixture: ComponentFixture<OwnWalletComponent>;
  let component: OwnWalletComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [OwnWalletComponent]
    });

    fixture = TestBed.createComponent(OwnWalletComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });

});
