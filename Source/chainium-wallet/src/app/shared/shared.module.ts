import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { OwnNavbarModule } from './own-navbar/own-navbar.module';
import { OwnCardModule } from './own-card/own-card.module';
import { OwnIconModule } from './own-icon/own-icon.module';
import { OwnSliderModule } from './own-slider/own-slider.module';
import { OwnModalModule } from './own-modal/own-modal.module';

import { CamelToSpacePipe } from './pipes/camel-to-space.pipe';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    OwnNavbarModule,
    OwnCardModule,
    OwnIconModule,
    OwnSliderModule,
    OwnModalModule
  ],
  exports: [
    ReactiveFormsModule,
    OwnNavbarModule,
    OwnCardModule,
    OwnIconModule,
    CamelToSpacePipe,
    OwnSliderModule,
    OwnModalModule
  ],
  declarations: [
    CamelToSpacePipe
  ]
})
export class SharedModule { }
