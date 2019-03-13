import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SetAssetControllerComponent } from "./set-asset-controller.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SetAssetControllerComponent", () => {

  let fixture: ComponentFixture<SetAssetControllerComponent>;
  let component: SetAssetControllerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SetAssetControllerComponent]
    });

    fixture = TestBed.createComponent(SetAssetControllerComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
