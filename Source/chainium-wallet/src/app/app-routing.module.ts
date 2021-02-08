import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Guards
import { AccessGuard } from "./shared/guards/access.guard";

// App level components
import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";

// Info section
import { InfoPageComponent } from "./info/info-page/info-page.component";
import { AddressInfoComponent } from "./info/address-info/address-info.component";
import { AccountInfoComponent } from "./info/account-info/account-info.component";
import { AssetInfoComponent } from "./info/asset-info/asset-info.component";
import { TransactionInfoComponent } from "./info/transaction-info/transaction-info.component";
import { BlockInfoComponent } from "./info/block-info/block-info.component";
import { ValidatorInfoComponent } from "./info/validator-info/validator-info.component";
import { EquivocationProofInfoComponent } from "./info/equivocation-proof-info/equivocation-proof-info.component";

// Wallet section
import { WelcomeComponent } from "./wallet/welcome/welcome.component";
import { ImportComponent } from "./wallet/import/import.component";
import { CreateComponent } from "./wallet/create/create.component";
import { SendChxComponent } from "./wallet/actions/send-chx/send-chx.component";
import { ReceiveChxComponent } from "./wallet/actions/receive-chx/receive-chx.component";
import { ValidatorManagmentComponent } from "./wallet/validator-managment/validator-managment.component";
import { StakingComponent } from "./wallet/staking/staking.component";
import { MessageSignVerificationComponent } from "./wallet/msg-sign-verify/msg-sign-verify.component";
import { BridgeChxComponent } from "./wallet/actions/bridge-chx/bridge-chx.component";

export const ROUTERCONFIGS: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "info",
    component: InfoPageComponent,
    children: [
      {
        path: "",
        redirectTo: "block",
        pathMatch: "full",
      },
      {
        path: "address",
        component: AddressInfoComponent,
        data: { state: "address" },
      },
      {
        path: "address/:addressHash",
        component: AddressInfoComponent,
        data: { state: "address" },
      },
      {
        path: "account",
        component: AccountInfoComponent,
        data: { state: "account" },
      },
      {
        path: "account/:accountHash",
        component: AccountInfoComponent,
        data: { state: "account" },
      },
      {
        path: "asset",
        component: AssetInfoComponent,
        data: { state: "asset" },
      },
      {
        path: "asset/:assetHash",
        component: AssetInfoComponent,
        data: { state: "asset" },
      },
      {
        path: "tx",
        component: TransactionInfoComponent,
        data: { state: "tx" },
      },
      {
        path: "tx/:transactionHash",
        component: TransactionInfoComponent,
        data: { state: "tx" },
      },
      {
        path: "block",
        component: BlockInfoComponent,
        data: { state: "block" },
      },
      {
        path: "block/:blockNumber",
        component: BlockInfoComponent,
        data: { state: "block" },
      },
      {
        path: "validator",
        component: ValidatorInfoComponent,
        data: { state: "validator" },
      },
      {
        path: "validator/:validatorHash",
        component: ValidatorInfoComponent,
        data: { state: "validator" },
      },
      {
        path: "equivocation/:equivocationProofHash",
        component: EquivocationProofInfoComponent,
      },
    ],
  },
  {
    path: "wallet",
    canActivate: [AccessGuard],
    component: WelcomeComponent,
    children: [
      {
        path: "create",
        component: CreateComponent,
        data: { state: "create" },
      },
      {
        path: "import",
        component: ImportComponent,
        data: { state: "import" },
      },
      {
        path: "send-chx",
        component: SendChxComponent,
        data: { state: "send-chx" },
      },
      {
        path: "receive-chx",
        component: ReceiveChxComponent,
        data: { state: "receive-chx" },
      },
      {
        path: "bridge",
        component: BridgeChxComponent,
        data: { state: "bridge" },
      },
      {
        path: "validator-managment",
        component: ValidatorManagmentComponent,
        data: { state: "validator-managment" },
      },
      {
        path: "staking",
        component: StakingComponent,
        data: { state: "staking" },
      },
      {
        path: "sign-verify",
        component: MessageSignVerificationComponent,
        data: { state: "sign-verify" },
      },
    ],
    runGuardsAndResolvers: "always",
  },
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/wallet",
  },
  {
    path: "**",
    pathMatch: "full",
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTERCONFIGS, {
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
