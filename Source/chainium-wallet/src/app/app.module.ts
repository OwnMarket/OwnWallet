import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WalletHttpInterceptor } from './shared/services/wallet-http-interceptor';
import { GlobalErrorHandler } from './shared/services/global.error.handler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedModule } from './shared/shared.module';
import { QrCodeModule } from 'ng-qrcode';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoaderService } from './shared/services/loader.service';
import { StateService } from './shared/services/state.service';
import { ConfigurationService } from './shared/services/configuration.service';

// App level components
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LongPress } from './shared';

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
import { BridgeChxComponent } from './wallet/actions/bridge-chx/bridge-chx.component';
import { AddAccountComponent } from './wallet/actions/add-account/add-account.component';
import { PortfolioComponent } from './wallet/portfolio/portfolio.component';
import { AddAssetComponent } from './wallet/actions/add-asset/add-asset.component';

@NgModule({
  declarations: [
    AppComponent,
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
    PageNotFoundComponent,
    BridgeChxComponent,
    LongPress,
    AddAccountComponent,
    PortfolioComponent,
    AddAssetComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    ClipboardModule,
    NgxDatatableModule,
    QrCodeModule,
    AppRoutingModule,
  ],
  providers: [
    LoaderService,
    ConfigurationService,
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: WalletHttpInterceptor,
      multi: true,
    },
    StateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
