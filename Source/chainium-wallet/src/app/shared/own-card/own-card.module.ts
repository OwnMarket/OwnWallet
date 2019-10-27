import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwnCardComponent } from './own-card/own-card.component';
import { OwnCardTitleComponent } from './own-card-title/own-card-title.component';
import { OwnCardBodyComponent } from './own-card-body/own-card-body.component';


@NgModule({
  declarations: [
    OwnCardComponent,
    OwnCardTitleComponent,
    OwnCardBodyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    OwnCardComponent,
    OwnCardTitleComponent,
    OwnCardBodyComponent
  ]
})
export class OwnCardModule { }
