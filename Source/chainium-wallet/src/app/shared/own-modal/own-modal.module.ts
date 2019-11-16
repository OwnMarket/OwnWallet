import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnModalComponent } from './own-modal/own-modal.component';

@NgModule({
  declarations: [
    OwnModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OwnModalComponent
  ]
})
export class OwnModalModule { }
