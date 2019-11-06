import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';

import { LoginComponent } from './login/login.component';

import { WalletRoutingModule } from './wallet-routing.module';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
