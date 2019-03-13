import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SetAccountControllerComponent } from "./set-account-controller.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SetAccountControllerComponent", () => {

  let fixture: ComponentFixture<SetAccountControllerComponent>;
  let component: SetAccountControllerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SetAccountControllerComponent]
    });

    fixture = TestBed.createComponent(SetAccountControllerComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
