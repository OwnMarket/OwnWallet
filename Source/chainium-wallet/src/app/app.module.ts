import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { GoogleMaterialModule } from './/google-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './/app-routing.module';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { WalletComponent } from './wallet/wallet.component';
import { ImportWalletComponent } from './import-wallet/import-wallet.component';
import { BalanceInfoComponent } from './balance-info/balance-info.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { SubmitTransactionComponent } from './submit-transaction/submit-transaction.component';
import { TransactionInfoComponent } from './transaction-info/transaction-info.component';
import { BlockInfoComponent } from './block-info/block-info.component';
import { ChxTransferComponent } from './actions/chx-transfer/chx-transfer.component';
import { AssetTransferComponent } from './actions/asset-transfer/asset-transfer.component';
import { SubmitTransactionInfoComponent } from './submit-transaction-info/submit-transaction-info.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandler } from './services/global.error.handler';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { AddressInfoComponent } from './address-info/address-info.component';
import { GenerateAccountComponent } from './generate-account/generate-account.component';
import { WalletHttpInterceptor } from './services/wallet-http-interceptor';
import { LoaderComponent } from './loader/loader.component';
import { DelegateStakeComponent } from './actions/delegate-stake/delegate-stake.component';
import { ConfigureValidatorComponent } from './actions/configure-validator/configure-validator.component';
import { CreateAssetEmissionComponent } from './actions/create-asset-emission/create-asset-emission.component';
import { SetAssetCodeComponent } from './actions/set-asset-code/set-asset-code.component';
import { SetAssetControllerComponent } from './actions/set-asset-controller/set-asset-controller.component';
import { SetAccountControllerComponent } from './actions/set-account-controller/set-account-controller.component';
import { SubmitVoteComponent } from './actions/submit-vote/submit-vote.component';
import { SubmitVoteWeightComponent } from './actions/submit-vote-weight/submit-vote-weight.component';
import { RemoveValidatorComponent } from './actions/remove-validator/remove-validator.component';
import { AssetInfoComponent } from './asset-info/asset-info.component';
import { ValidatorInfoComponent } from './validator-info/validator-info.component';
import { FormsModule } from '@angular/forms';
import { CreateAssetComponent } from './actions/create-asset/create-asset.component';
import { CreateAccountComponent } from './actions/create-account/create-account.component';
import { EquivocationProofInfoComponent } from './equivocation-proof-info/equivocation-proof-info.component';
import { MessageSignVerificationComponent } from './msg-sign-verify/msg-sign-verify.component';

@NgModule({
  entryComponents: [SubmitTransactionInfoComponent, ErrorDialogComponent, LoaderComponent],
  declarations: [
    AppComponent,
    WalletComponent,
    ImportWalletComponent,
    BalanceInfoComponent,
    AccountInfoComponent,
    AssetInfoComponent,
    ValidatorInfoComponent,
    SubmitTransactionComponent,
    TransactionInfoComponent,
    BlockInfoComponent,
    EquivocationProofInfoComponent,
    ChxTransferComponent,
    AssetTransferComponent,
    DelegateStakeComponent,
    ConfigureValidatorComponent,
    RemoveValidatorComponent,
    CreateAssetEmissionComponent,
    CreateAssetComponent,
    SetAssetCodeComponent,
    SetAssetControllerComponent,
    CreateAccountComponent,
    SetAccountControllerComponent,
    SubmitVoteComponent,
    SubmitVoteWeightComponent,
    SubmitTransactionInfoComponent,
    HomeScreenComponent,
    ErrorDialogComponent,
    AddressInfoComponent,
    GenerateAccountComponent,
    LoaderComponent,
    MessageSignVerificationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    GoogleMaterialModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ClipboardModule
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
