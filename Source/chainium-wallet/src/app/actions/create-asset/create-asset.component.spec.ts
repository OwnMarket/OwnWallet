import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CreateAssetComponent } from "./create-asset.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CreateAssetComponent", () => {

  let fixture: ComponentFixture<CreateAssetComponent>;
  let component: CreateAssetComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CreateAssetComponent]
    });

    fixture = TestBed.createComponent(CreateAssetComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
