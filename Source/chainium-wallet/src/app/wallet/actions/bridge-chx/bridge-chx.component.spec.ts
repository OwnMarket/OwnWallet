import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BridgeChxComponent } from "./bridge-chx.component";

describe("BridgeChxComponent", () => {
  let component: BridgeChxComponent;
  let fixture: ComponentFixture<BridgeChxComponent>;

  beforeEach(waitForAsync(() => {
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
