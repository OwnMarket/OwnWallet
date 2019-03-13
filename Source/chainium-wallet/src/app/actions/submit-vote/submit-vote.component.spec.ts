import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SubmitVoteComponent } from "./submit-vote.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SubmitVoteComponent", () => {

  let fixture: ComponentFixture<SubmitVoteComponent>;
  let component: SubmitVoteComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SubmitVoteComponent]
    });

    fixture = TestBed.createComponent(SubmitVoteComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
