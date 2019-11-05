import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../../shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';
import { OwnCardModule, OwnIconModule } from '../../shared';

import { WelcomeComponent } from './welcome/welcome.component';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    WelcomeComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    SharedModule,
    ClipboardModule,
    OwnCardModule,
    OwnIconModule,
    WelcomeRoutingModule
  ]
})
export class WelcomeModule { }
