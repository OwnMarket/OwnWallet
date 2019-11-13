import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ConfigureValidatorComponent } from "./configure-validator.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ConfigureValidatorComponent", () => {

  let fixture: ComponentFixture<ConfigureValidatorComponent>;
  let component: ConfigureValidatorComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ConfigureValidatorComponent]
    });

    fixture = TestBed.createComponent(ConfigureValidatorComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
