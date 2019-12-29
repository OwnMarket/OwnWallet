import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { GoogleMaterialModule } from './/google-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { RecoverPkFromOldDerivationPathComponent } from './recover-pk-from-old-derivation-path/recover-pk-from-old-derivation-path.component';
import { SubmitTransactionComponent } from './submit-transaction/submit-transaction.component';
import { ChxTransferComponent } from './actions/chx-transfer/chx-transfer.component';
import { AssetTransferComponent } from './actions/asset-transfer/asset-transfer.component';
import { SubmitTransactionInfoComponent } from './submit-transaction-info/submit-transaction-info.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandler } from './services/global.error.handler';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { GenerateAccountComponent } from './generate-account/generate-account.component';
import { WalletHttpInterceptor } from './services/wallet-http-interceptor';
import { LoaderComponent } from './loader/loader.component';
import { DelegateStakeComponent } from './actions/delegate-stake/delegate-stake.component';
import { CreateAssetEmissionComponent } from './actions/create-asset-emission/create-asset-emission.component';
import { SetAssetCodeComponent } from './actions/set-asset-code/set-asset-code.component';
import { SetAssetControllerComponent } from './actions/set-asset-controller/set-asset-controller.component';
import { SetAccountControllerComponent } from './actions/set-account-controller/set-account-controller.component';
import { SubmitVoteComponent } from './actions/submit-vote/submit-vote.component';
import { SubmitVoteWeightComponent } from './actions/submit-vote-weight/submit-vote-weight.component';
import { FormsModule } from '@angular/forms';
import { CreateAssetComponent } from './actions/create-asset/create-asset.component';
import { CreateAccountComponent } from './actions/create-account/create-account.component';
import { LoginComponent } from './login/login.component';


@NgModule({
    entryComponents: [
        SubmitTransactionInfoComponent,
        ErrorDialogComponent,
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
        ErrorDialogComponent,
        GenerateAccountComponent,
        LoaderComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        GoogleMaterialModule,
        ClipboardModule,
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
