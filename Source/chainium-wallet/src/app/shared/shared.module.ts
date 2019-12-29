import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { OwnNavbarModule } from './own-navbar/own-navbar.module';
import { OwnCardModule } from './own-card/own-card.module';
import { OwnIconModule } from './own-icon/own-icon.module';
import { OwnSliderModule } from './own-slider/own-slider.module';
import { OwnModalModule } from './own-modal/own-modal.module';
import { OwnDropdownMenuModule } from './own-dropdown-menu/own-dropdown-menu.module';

import { CamelToSpacePipe } from './pipes/camel-to-space.pipe';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    OwnNavbarModule,
    OwnCardModule,
    OwnIconModule,
    OwnSliderModule,
    OwnModalModule,
    OwnDropdownMenuModule
  ],
  exports: [
    ReactiveFormsModule,
    OwnNavbarModule,
    OwnCardModule,
    OwnIconModule,
    CamelToSpacePipe,
    OwnSliderModule,
    OwnModalModule,
    OwnDropdownMenuModule
  ],
  declarations: [
    CamelToSpacePipe
  ]
})
export class SharedModule { }
