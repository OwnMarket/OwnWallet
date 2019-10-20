import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoPageComponent } from './info-page/info-page.component';
import { AddressInfoComponent } from './address-info/address-info.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AssetInfoComponent } from './asset-info/asset-info.component';
import { TransactionInfoComponent } from './transaction-info/transaction-info.component';
import { BlockInfoComponent } from './block-info/block-info.component';

const routes: Routes = [
  {
    path: '',
    component: InfoPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'block',
        pathMatch: 'full'
      },
      {
        path: 'address',
        component: AddressInfoComponent
      },
      {
        path: 'address/:addressHash',
        component: AddressInfoComponent
      },
      {
        path: 'account',
        component: AccountInfoComponent
      },
      {
        path: 'account/:accountHash',
        component: AccountInfoComponent
      },
      {
        path: 'asset',
        component: AssetInfoComponent
      },
      {
        path: 'asset/:assetHash',
        component: AssetInfoComponent
      },
      {
        path: 'tx',
        component: TransactionInfoComponent
      },
      {
        path: 'tx/:transactionHash',
        component: TransactionInfoComponent
      },
      {
        path: 'block',
        component: BlockInfoComponent
      },
      {
        path: 'block/:blockNumber',
        component: BlockInfoComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
