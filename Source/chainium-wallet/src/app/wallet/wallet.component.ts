import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CryptoService } from "../services/crypto.service"
import { WalletInfo } from '../models/wallet-info.model';
import { PrivatekeyService } from '../services/privatekey.service';
import { WalletService } from '../services/wallet.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  walletInfo: WalletInfo;
  displayWalletInfo: boolean;
  seed: string;

  constructor(private cryptoService: CryptoService,
    private privateKeyService: PrivatekeyService,
    private walletService: WalletService) {
    this.displayWalletInfo = false;
    this.seed = this.privateKeyService.seed;
  }

  ngOnInit() { }

  onGenerateWalletClick() {
    const walletCount = JSON.parse(localStorage.walletCount || 0) + 1;

    this.cryptoService.generateWalletFromSeed(this.seed, walletCount)
      .subscribe((wallet: WalletInfo) => {
        localStorage.walletCount = walletCount;
        this.setWalletInfo(wallet);
      });
  }

  private setWalletInfo(wallet: WalletInfo): void {
    if (!wallet) {
      throw "Unable to generate wallet."
    }

    this.walletInfo = wallet;
    this.walletService.wallets.push(wallet);
  }
}
