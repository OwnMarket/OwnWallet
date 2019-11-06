import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';

import { HomeScreenComponent } from './home-screen/home-screen.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomeScreenComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    SharedModule,
    ClipboardModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
