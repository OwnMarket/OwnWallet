import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';

import { WelcomeComponent } from './welcome/welcome.component';
import { ImportComponent } from './import/import.component';
import { CreateComponent } from './create/create.component';

import { WalletRoutingModule } from './wallet-routing.module';

@NgModule({
  declarations: [
    CreateComponent,
    ImportComponent,
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    SharedModule,
    ClipboardModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
