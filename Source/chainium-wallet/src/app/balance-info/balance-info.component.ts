import { Component, OnInit } from '@angular/core';
import { ChxAddressInfo } from '../models/ChxAddressInfo';
import { PrivatekeyService } from '../services/privatekey.service';
import { CryptoService } from '../services/crypto.service';
import { NodeService } from '../services/node.service';

@Component({
  selector: 'app-balance-info',
  templateUrl: './balance-info.component.html',
  styleUrls: ['./balance-info.component.css']
})
export class BalanceInfoComponent implements OnInit {
  addressInfo: ChxAddressInfo;

  constructor(private cryptoService: CryptoService,
    private privateKeyService: PrivatekeyService,
    private nodeService: NodeService) {
    this.onRefreshAddressInfoClick();

    this.privateKeyService.getMessage().subscribe(message => this.onRefreshAddressInfoClick());
  }

  ngOnInit() {
  }


  onRefreshAddressInfoClick() {
    if (!this.privateKeyService.existsKey()) {
      this.addressInfo = null;
      return;
    }

    this.cryptoService
      .getAddressFromKey(this.privateKeyService.walletInfo.privateKey)
      .subscribe(addr => this.setAddress(addr));
  }

  private setAddress(addr: any): void {
    this.nodeService
      .getAddressInfo(this.privateKeyService.walletInfo.address)
      .subscribe(addr => {
        if (!addr || addr.errors) {
          this.privateKeyService.walletInfo = null;
          this.addressInfo = null;
          return;
        }
        this.addressInfo = addr as ChxAddressInfo;
      });
  }

}
