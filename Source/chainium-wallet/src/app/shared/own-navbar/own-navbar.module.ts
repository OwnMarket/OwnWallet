import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnNavbarComponent } from './own-navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    OwnNavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    OwnNavbarComponent
  ]
})
export class OwnNavbarModule { }
