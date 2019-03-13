import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CreateAccountComponent } from "./create-account.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CreateAccountComponent", () => {

  let fixture: ComponentFixture<CreateAccountComponent>;
  let component: CreateAccountComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CreateAccountComponent]
    });

    fixture = TestBed.createComponent(CreateAccountComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
