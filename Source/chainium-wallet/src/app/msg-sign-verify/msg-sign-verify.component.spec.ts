import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MessageSignVerificationComponent } from "./msg-sign-verify.component";

describe("MessageSignVerificationComponent", () => {

  let fixture: ComponentFixture<MessageSignVerificationComponent>;
  let component: MessageSignVerificationComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [MessageSignVerificationComponent]
    });

    fixture = TestBed.createComponent(MessageSignVerificationComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });

});
