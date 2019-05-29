import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CopyPrivateKeyComponent } from "./copy-private-key.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CopyPrivateKeyComponent", () => {

  let fixture: ComponentFixture<CopyPrivateKeyComponent>;
  let component: CopyPrivateKeyComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CopyPrivateKeyComponent]
    });

    fixture = TestBed.createComponent(CopyPrivateKeyComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
