import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SubmitVoteWeightComponent } from "./submit-vote-weight.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SubmitVoteWeightComponent", () => {

  let fixture: ComponentFixture<SubmitVoteWeightComponent>;
  let component: SubmitVoteWeightComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SubmitVoteWeightComponent]
    });

    fixture = TestBed.createComponent(SubmitVoteWeightComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
