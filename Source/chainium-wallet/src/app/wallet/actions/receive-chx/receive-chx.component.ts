import { WalletInfo } from '../../../shared/models/wallet-info.model';
import { Component, OnInit } from '@angular/core';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';

@Component({
  selector: 'app-receive-chx',
  templateUrl: './receive-chx.component.html',
  styleUrls: ['./receive-chx.component.css']
})
export class ReceiveChxComponent implements OnInit {

  isKeyImported = false;
  wallet: WalletInfo;

  constructor(
    private privateKeyService: PrivatekeyService
  ) {
    this.isKeyImported = privateKeyService.existsKey();
    if (!this.isKeyImported) { return; }
    this.wallet = this.privateKeyService.getWalletInfo();
  }

  ngOnInit() {
  }

}
