import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from '../shared/shared.module';
import { ClipboardModule } from 'ngx-clipboard';
import { OwnCardModule, OwnIconModule } from '../shared';
import { InfoRoutingModule } from './info-routing.module';

import { InfoPageComponent } from './info-page/info-page.component';
import { AddressInfoComponent } from './address-info/address-info.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AssetInfoComponent } from './asset-info/asset-info.component';
import { TransactionInfoComponent } from './transaction-info/transaction-info.component';
import { BlockInfoComponent } from './block-info/block-info.component';
import { ValidatorInfoComponent } from './validator-info/validator-info.component';


@NgModule({
  declarations: [
    InfoPageComponent,
    AddressInfoComponent,
    AccountInfoComponent,
    AssetInfoComponent,
    TransactionInfoComponent,
    BlockInfoComponent,
    ValidatorInfoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    ClipboardModule,
    OwnCardModule,
    OwnIconModule,
    InfoRoutingModule
  ]
})
export class InfoModule { }
