import { NO_ERRORS_SCHEMA } from "@angular/core";
import { DelegateStakeComponent } from "./delegate-stake.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("DelegateStakeComponent", () => {

  let fixture: ComponentFixture<DelegateStakeComponent>;
  let component: DelegateStakeComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [DelegateStakeComponent]
    });

    fixture = TestBed.createComponent(DelegateStakeComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
