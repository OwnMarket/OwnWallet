import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnNavbarModule } from './own-navbar/own-navbar.module';
import { OwnCardModule } from './own-card/own-card.module';
import { OwnIconModule } from './own-icon/own-icon.module';
import { CamelToSpacePipe } from './pipes/camel-to-space.pipe';

@NgModule({
  imports: [
    CommonModule,
    OwnNavbarModule,
    OwnCardModule,
    OwnIconModule
  ],
  exports: [
    OwnNavbarModule,
    OwnCardModule,
    OwnIconModule,
    CamelToSpacePipe
  ],
  declarations: [
    CamelToSpacePipe
  ]
})
export class SharedModule { }
