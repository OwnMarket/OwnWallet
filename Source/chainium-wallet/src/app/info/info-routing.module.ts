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
        component: AddressInfoComponent,
        data: { state: 'address' }
      },
      {
        path: 'address/:addressHash',
        component: AddressInfoComponent,
        data: { state: 'address' }
      },
      {
        path: 'account',
        component: AccountInfoComponent,
        data: { state: 'account' }
      },
      {
        path: 'account/:accountHash',
        component: AccountInfoComponent,
        data: { state: 'account' }
      },
      {
        path: 'asset',
        component: AssetInfoComponent,
        data: { state: 'asset' }
      },
      {
        path: 'asset/:assetHash',
        component: AssetInfoComponent,
        data: { state: 'asset' }
      },
      {
        path: 'tx',
        component: TransactionInfoComponent,
        data: { state: 'tx' }
      },
      {
        path: 'tx/:transactionHash',
        component: TransactionInfoComponent,
        data: { state: 'tx' }
      },
      {
        path: 'block',
        component: BlockInfoComponent,
        data: { state: 'block' }
      },
      {
        path: 'block/:blockNumber',
        component: BlockInfoComponent,
        data: { state: 'block' }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
