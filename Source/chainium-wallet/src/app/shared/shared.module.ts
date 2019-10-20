import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnNavbarModule } from './own-navbar/own-navbar.module';
import { CamelToSpacePipe } from './pipes/camel-to-space.pipe';

@NgModule({
  imports: [
    CommonModule,
    OwnNavbarModule
  ],
  exports: [
    OwnNavbarModule,
    CamelToSpacePipe
  ],
  declarations: [
    CamelToSpacePipe
  ]
})
export class SharedModule { }
