import { WalletComponent } from '../wallet/wallet.component'
import { ImportWalletComponent } from '../import-wallet/import-wallet.component';
import { AccountInfoComponent } from '../account-info/account-info.component';
import { SubmitTransactionComponent } from '../submit-transaction/submit-transaction.component';
import { TransactionInfoComponent } from '../transaction-info/transaction-info.component';
import { BlockInfoComponent } from '../block-info/block-info.component';
import { HomeScreenComponent } from '../home-screen/home-screen.component';
import { AddressInfoComponent } from '../address-info/address-info.component';
import { GenerateAccountComponent } from '../generate-account/generate-account.component';
import { AssetInfoComponent } from '../asset-info/asset-info.component';
import { ValidatorInfoComponent } from '../validator-info/validator-info.component';
import { EquivocationProofInfoComponent } from '../equivocation-proof-info/equivocation-proof-info.component';
import { MessageSignVerificationComponent } from '../msg-sign-verif/msg-sign-verif.component';


export const ROUTERCONFIGS = [
  { path: 'wallet', component: WalletComponent },
  { path: 'importwallet', component: ImportWalletComponent },
  { path: 'accountinfo', component: AccountInfoComponent },
  { path: 'accountinfo/:accountHash', component: AccountInfoComponent },
  { path: 'submissions', component: SubmitTransactionComponent },
  { path: 'transaction', component: TransactionInfoComponent },
  { path: 'transaction/:transactionHash', component: TransactionInfoComponent },
  { path: 'block', component: BlockInfoComponent },
  { path: 'block/:blockNumber', component: BlockInfoComponent },
  { path: '', component: HomeScreenComponent },
  { path: 'addressinfo', component: AddressInfoComponent },
  { path: 'addressinfo/:addressHash', component: AddressInfoComponent },
  { path: 'assetInfo', component: AssetInfoComponent },
  { path: 'assetInfo/:assetHash', component: AssetInfoComponent },
  { path: 'validatorInfo', component: ValidatorInfoComponent },
  { path: 'validatorInfo/:validatorHash', component: ValidatorInfoComponent },
  { path: 'equivocationInfo/:equivocationProofHash', component: EquivocationProofInfoComponent },
  //{ path: 'generateaccount', component: GenerateAccountComponent },
  { path: 'messageSigningVerification', component: MessageSignVerificationComponent },
];
