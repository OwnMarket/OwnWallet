import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';
import { QrCodeModule } from 'ng-qrcode';

import { WelcomeComponent } from './welcome/welcome.component';
import { ImportComponent } from './import/import.component';
import { CreateComponent } from './create/create.component';

import { WalletRoutingModule } from './wallet-routing.module';
import { SendChxComponent } from './actions/send-chx/send-chx.component';
import { ReceiveChxComponent } from './actions/receive-chx/receive-chx.component';

@NgModule({
  declarations: [
    CreateComponent,
    ImportComponent,
    WelcomeComponent,
    SendChxComponent,
    ReceiveChxComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    SharedModule,
    ClipboardModule,
    QrCodeModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
