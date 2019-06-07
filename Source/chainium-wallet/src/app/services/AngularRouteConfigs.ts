import { ImportWalletComponent } from '../import-wallet/import-wallet.component';
import { RecoverPkFromOldDerivationPathComponent } from '../recover-pk-from-old-derivation-path/recover-pk-from-old-derivation-path.component';
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
import { MessageSignVerificationComponent } from '../msg-sign-verify/msg-sign-verify.component';
import { LoginComponent } from '../login/login.component';
import { AccessGuard } from '../_guards/access.guard';
import { PrivateComponent } from '../layout/private.component';
import { NewWalletComponent } from '../hdcrypto/new-wallet.component';
import { RestoreWalletComponent } from '../hdcrypto/restore-wallet.component';
import { UnloadWalletComponent } from '../hdcrypto/unload-wallet.component';

export const ROUTERCONFIGS = [
    {
        path: '',
        component: PrivateComponent,
        canActivate: [AccessGuard],
        children: [
            { path: 'create-wallet', component: NewWalletComponent},
            { path: 'restore-wallet', component: RestoreWalletComponent},
            { path: 'unload-wallet', component: UnloadWalletComponent},
            { path: 'import-wallet', component: ImportWalletComponent },
            { path: 'account', component: AccountInfoComponent },
            { path: 'account/:accountHash', component: AccountInfoComponent },
            { path: 'submit-tx', component: SubmitTransactionComponent },
            { path: 'tx', component: TransactionInfoComponent },
            { path: 'tx/:transactionHash', component: TransactionInfoComponent },
            { path: 'block', component: BlockInfoComponent },
            { path: 'block/:blockNumber', component: BlockInfoComponent },
            { path: 'home', component: HomeScreenComponent, canActivate: [AccessGuard] },
            { path: 'address', component: AddressInfoComponent },
            { path: 'address/:addressHash', component: AddressInfoComponent },
            { path: 'asset', component: AssetInfoComponent },
            { path: 'asset/:assetHash', component: AssetInfoComponent },
            { path: 'validator', component: ValidatorInfoComponent },
            { path: 'validator/:validatorHash', component: ValidatorInfoComponent },
            { path: 'equivocation/:equivocationProofHash', component: EquivocationProofInfoComponent },
            //{ path: 'generateaccount', component: GenerateAccountComponent },
            { path: 'sign-verify', component: MessageSignVerificationComponent },
            { path: 'recover-pk-from-old-derivation-path', component: RecoverPkFromOldDerivationPathComponent }
        ]
    },
    { path: 'login', component: LoginComponent }
];
