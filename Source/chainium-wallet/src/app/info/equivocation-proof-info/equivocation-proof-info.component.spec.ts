import { NO_ERRORS_SCHEMA } from "@angular/core";
import { EquivocationProofInfoComponent } from "./equivocation-proof-info.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("EquivocationProofInfoComponent", () => {

  let fixture: ComponentFixture<EquivocationProofInfoComponent>;
  let component: EquivocationProofInfoComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [EquivocationProofInfoComponent]
    });

    fixture = TestBed.createComponent(EquivocationProofInfoComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
