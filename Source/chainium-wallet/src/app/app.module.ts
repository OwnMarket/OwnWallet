import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WalletHttpInterceptor } from './services/wallet-http-interceptor';
import { GlobalErrorHandler } from './services/global.error.handler';
import { GoogleMaterialModule } from './/google-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from './shared/shared.module';
import { QrCodeModule } from 'ng-qrcode';
import { AppRoutingModule } from './/app-routing.module';

import { AppComponent } from './app.component';
import { RecoverPkFromOldDerivationPathComponent } from './recover-pk-from-old-derivation-path/recover-pk-from-old-derivation-path.component';
import { SubmitTransactionComponent } from './submit-transaction/submit-transaction.component';
import { ChxTransferComponent } from './actions/chx-transfer/chx-transfer.component';
import { AssetTransferComponent } from './actions/asset-transfer/asset-transfer.component';
import { SubmitTransactionInfoComponent } from './submit-transaction-info/submit-transaction-info.component';
import { GenerateAccountComponent } from './generate-account/generate-account.component';
import { LoaderComponent } from './loader/loader.component';
import { DelegateStakeComponent } from './actions/delegate-stake/delegate-stake.component';
import { CreateAssetEmissionComponent } from './actions/create-asset-emission/create-asset-emission.component';
import { SetAssetCodeComponent } from './actions/set-asset-code/set-asset-code.component';
import { SetAssetControllerComponent } from './actions/set-asset-controller/set-asset-controller.component';
import { SetAccountControllerComponent } from './actions/set-account-controller/set-account-controller.component';
import { SubmitVoteComponent } from './actions/submit-vote/submit-vote.component';
import { SubmitVoteWeightComponent } from './actions/submit-vote-weight/submit-vote-weight.component';
import { CreateAssetComponent } from './actions/create-asset/create-asset.component';
import { CreateAccountComponent } from './actions/create-account/create-account.component';

// App level components
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

// Info section
import { InfoPageComponent } from './info/info-page/info-page.component';
import { AddressInfoComponent } from './info/address-info/address-info.component';
import { AccountInfoComponent } from './info/account-info/account-info.component';
import { AssetInfoComponent } from './info/asset-info/asset-info.component';
import { TransactionInfoComponent } from './info/transaction-info/transaction-info.component';
import { BlockInfoComponent } from './info/block-info/block-info.component';
import { ValidatorInfoComponent } from './info/validator-info/validator-info.component';
import { EquivocationProofInfoComponent } from './info/equivocation-proof-info/equivocation-proof-info.component';

// Wallet section
import { WelcomeComponent } from './wallet/welcome/welcome.component';
import { ImportComponent } from './wallet/import/import.component';
import { CreateComponent } from './wallet/create/create.component';
import { SendChxComponent } from './wallet/actions/send-chx/send-chx.component';
import { ReceiveChxComponent } from './wallet/actions/receive-chx/receive-chx.component';
import { ValidatorManagmentComponent } from './wallet/validator-managment/validator-managment.component';
import { StakingComponent } from './wallet/staking/staking.component';
import { MessageSignVerificationComponent } from './wallet/msg-sign-verify/msg-sign-verify.component';

@NgModule({
    entryComponents: [
        SubmitTransactionInfoComponent,
        LoaderComponent
    ],
    declarations: [
        AppComponent,
        RecoverPkFromOldDerivationPathComponent,
        SubmitTransactionComponent,
        ChxTransferComponent,
        AssetTransferComponent,
        DelegateStakeComponent,
        CreateAssetEmissionComponent,
        CreateAssetComponent,
        SetAssetCodeComponent,
        SetAssetControllerComponent,
        CreateAccountComponent,
        SetAccountControllerComponent,
        SubmitVoteComponent,
        SubmitVoteWeightComponent,
        SubmitTransactionInfoComponent,
        GenerateAccountComponent,
        LoaderComponent,
        LoginComponent,
        // info section
        InfoPageComponent,
        AddressInfoComponent,
        AccountInfoComponent,
        AssetInfoComponent,
        TransactionInfoComponent,
        BlockInfoComponent,
        ValidatorInfoComponent,
        EquivocationProofInfoComponent,
        // wallet section
        CreateComponent,
        ImportComponent,
        WelcomeComponent,
        SendChxComponent,
        ReceiveChxComponent,
        ValidatorManagmentComponent,
        StakingComponent,
        MessageSignVerificationComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        GoogleMaterialModule,
        ClipboardModule,
        NgxDatatableModule,
        QrCodeModule,
        AppRoutingModule,
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: WalletHttpInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
