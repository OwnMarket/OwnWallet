import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CreateAssetEmissionComponent } from "./create-asset-emission.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CreateAssetEmissionComponent", () => {

  let fixture: ComponentFixture<CreateAssetEmissionComponent>;
  let component: CreateAssetEmissionComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CreateAssetEmissionComponent]
    });

    fixture = TestBed.createComponent(CreateAssetEmissionComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
