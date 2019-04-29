import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CryptoService} from "../services/crypto.service"
import { WalletInfo } from '../models/wallet-info.model';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  walletInfo : WalletInfo;
  displayWalletInfo : boolean; 
  
  constructor(private cryptoService : CryptoService) { 
    this.displayWalletInfo = false;
    //this.walletInfo = new WalletInfo();
  }

  ngOnInit() {}

  onGenerateWalletClick(){
      this.cryptoService
        .generateWallet()
        .subscribe(wallet => this.setWalletInfo(wallet));
  }

  private setWalletInfo(wallet : WalletInfo) : void{
    if(!wallet){
        throw "Unable to generate wallet."
    }

    this.walletInfo = wallet;
  }
}
