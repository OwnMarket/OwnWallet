import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecoverPkFromOldDerivationPathComponent } from './recover-pk-from-old-derivation-path/recover-pk-from-old-derivation-path.component';
import { SubmitTransactionComponent } from './submit-transaction/submit-transaction.component';
import { GenerateAccountComponent } from './generate-account/generate-account.component';
import { LoginComponent } from './login/login.component';
import { AccessGuard } from './_guards/access.guard';


export const ROUTERCONFIGS: Routes = [
/*
    {
        path: 'wallet',
        component: PrivateComponent,
        // canActivate: [AccessGuard],
        children: [
            { path: 'create-wallet', component: NewWalletComponent},
            { path: 'restore-wallet', component: RestoreWalletComponent},
            { path: 'unload-wallet', component: UnloadWalletComponent},
            { path: 'import-wallet', component: ImportWalletComponent },
            { path: 'submit-tx', component: SubmitTransactionComponent },
            { path: 'home', component: HomeScreenComponent, canActivate: [AccessGuard] },
            { path: 'validator', component: ValidatorInfoComponent },
            { path: 'validator/:validatorHash', component: ValidatorInfoComponent },
            { path: 'equivocation/:equivocationProofHash', component: EquivocationProofInfoComponent },
            //{ path: 'generateaccount', component: GenerateAccountComponent },
            { path: 'sign-verify', component: MessageSignVerificationComponent },
            { path: 'recover-pk-from-old-derivation-path', component: RecoverPkFromOldDerivationPathComponent }
        ]
    }, */
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'info',
      loadChildren: './info/info.module#InfoModule'
    },
    {
      path: 'wallet',
      loadChildren: './wallet/wallet.module#WalletModule',
      canActivate: [AccessGuard]
    },
    {
      path: '',
      pathMatch: 'full',
      redirectTo: '/wallet'
    }
];

@NgModule({
  imports: [ RouterModule.forRoot(ROUTERCONFIGS) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
