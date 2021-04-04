import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnSliderComponent } from './own-slider/own-slider.component';
import { OwnSlideComponent } from './own-slide/own-slide.component';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides =  {
    swipe: { velocity: 0.4, threshold: 20 },
    pan: { threshold: 40, pointers: 0 }
  };
}

@NgModule({
  declarations: [
    OwnSliderComponent,
    OwnSlideComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OwnSliderComponent,
    OwnSlideComponent
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    }
  ]
})
export class OwnSliderModule { }
