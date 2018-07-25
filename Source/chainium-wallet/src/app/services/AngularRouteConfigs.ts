import { Routes } from '@angular/router';
import { WalletComponent } from '../wallet/wallet.component'
import { ImportWalletComponent } from '../import-wallet/import-wallet.component';
import { AccountInfoComponent } from '../account-info/account-info.component';
import { SubmitTransactionComponent } from '../submit-transaction/submit-transaction.component';
import { TransactionInfoComponent } from '../transaction-info/transaction-info.component';
import { BlockInfoComponent } from '../block-info/block-info.component';
import { HomeScreenComponent } from '../home-screen/home-screen.component';
import { AddressInfoComponent } from '../address-info/address-info.component';
import { GenerateAccountComponent } from '../generate-account/generate-account.component';


export const ROUTERCONFIGS = [
  { path: 'wallet', component: WalletComponent },
  { path: 'importwallet', component: ImportWalletComponent },
  { path: 'accountinfo', component: AccountInfoComponent },
  { path: 'submissions', component: SubmitTransactionComponent },
  { path: 'transaction', component: TransactionInfoComponent },
  { path: 'transaction/:transactionHash', component: TransactionInfoComponent },
  { path: 'block', component: BlockInfoComponent },
  { path: '', component: HomeScreenComponent },
  { path: 'addressinfo', component: AddressInfoComponent },
  { path: 'generateaccount', component: GenerateAccountComponent }
];
