import { Component, OnInit } from "@angular/core";

import { PrivatekeyService } from "../services/privatekey.service";
import { WalletService } from "../services/wallet.service";
import { WalletInfo } from "../models/wallet-info.model";


@Component({
  selector: "app-own-wallet",
  templateUrl: "./own-wallet.component.html",
  styleUrls: ["./own-wallet.component.scss"]
})

export class OwnWalletComponent implements OnInit {
  wallets: WalletInfo[];
  selectedWallet: WalletInfo;

  displayBalanceInfo: boolean = false;

  constructor(private privateKeyService: PrivatekeyService,
    private walletService: WalletService) {
    if (this.walletService.existsWallet()) {
      this.wallets = this.walletService.wallets;
    }
    if (this.privateKeyService.existsKey()) {
      this.selectedWallet = this.privateKeyService.walletInfo;
    }
  }

  ngOnInit() {
  }


  onWalletChange(e) {
    if (this.selectedWallet) {
      this.displayBalanceInfo = true;
      this.privateKeyService.walletInfo = this.selectedWallet;
      this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
    }
  }
}
