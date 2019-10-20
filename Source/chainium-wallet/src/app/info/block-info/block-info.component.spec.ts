import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockInfoComponent } from './block-info.component';

describe('BlockInfoComponent', () => {
  let component: BlockInfoComponent;
  let fixture: ComponentFixture<BlockInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
