import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BridgeChxComponent } from "./bridge-chx.component";

describe("BridgeChxComponent", () => {
  let component: BridgeChxComponent;
  let fixture: ComponentFixture<BridgeChxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BridgeChxComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgeChxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
