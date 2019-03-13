import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SetAssetCodeComponent } from "./set-asset-code.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("SetAssetCodeComponent", () => {

  let fixture: ComponentFixture<SetAssetCodeComponent>;
  let component: SetAssetCodeComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [SetAssetCodeComponent]
    });

    fixture = TestBed.createComponent(SetAssetCodeComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
