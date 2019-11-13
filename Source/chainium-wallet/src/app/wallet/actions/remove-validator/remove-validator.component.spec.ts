import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RemoveValidatorComponent } from "./remove-validator.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("RemoveValidatorComponent", () => {

  let fixture: ComponentFixture<RemoveValidatorComponent>;
  let component: RemoveValidatorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [RemoveValidatorComponent]
    });

    fixture = TestBed.createComponent(RemoveValidatorComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
