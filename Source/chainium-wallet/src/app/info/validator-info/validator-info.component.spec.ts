import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ValidatorInfoComponent } from "./validator-info.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ValidatorInfoComponent", () => {

  let fixture: ComponentFixture<ValidatorInfoComponent>;
  let component: ValidatorInfoComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ValidatorInfoComponent]
    });

    fixture = TestBed.createComponent(ValidatorInfoComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
