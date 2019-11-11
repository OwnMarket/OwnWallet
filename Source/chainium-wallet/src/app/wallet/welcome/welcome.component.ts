import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChxAddressInfo } from 'src/app/models/chx-address-info.model';
import { WalletInfo } from 'src/app/models/wallet-info.model';

import { CryptoService } from 'src/app/services/crypto.service';
import { PrivatekeyService } from 'src/app/services/privatekey.service';
import { WalletService } from 'src/app/services/wallet.service';
import { NodeService } from 'src/app/services/node.service';

import { from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  addressInfo: ChxAddressInfo;
  selectedWallet: WalletInfo;
  selectedChxAddress: string;
  chxAddresses: string[] = [];
  showImportedPk: boolean;
  isWalletContextValid: boolean;
  addresses: Observable<ChxAddressInfo[]>;
  showAdvanced = false;

  constructor(
    private cryptoService: CryptoService,
    private privateKeyService: PrivatekeyService,
    private walletService: WalletService,
    private router: Router,
    private nodeService: NodeService
  ) {
    this.onRefreshAddressInfoClick();
    this.privateKeyService.getMessage().subscribe(msg => this.onRefreshAddressInfoClick());
    this.walletService.getMessage().subscribe(() => { this.validateWalletContext(); });
  }

  ngOnInit() {
    this.walletService.generateWalletFromContext();
  }

  onRefreshAddressInfoClick() {

    if (!this.privateKeyService.existsKey()) {
        this.addressInfo = null;
        this.selectWallet(null);
        this.showImportedPk = false;
        return;
    }

    this.validateWalletContext();
    this.selectWallet(this.privateKeyService.getWalletInfo());
    this.chxAddresses = this.walletService.getAllChxAddresses();
    this.showImportedPk = this.chxAddresses.indexOf(this.selectedChxAddress) === -1;
    this.cryptoService
        .getAddressFromKey(this.privateKeyService.getWalletInfo().privateKey)
        .subscribe(addr => this.setAddress(addr));
  }

  onAddChxAddressClick() {
      this.walletService.createNewChxAddress();
  }

  onImportPrivateKeyClick () {
      this.router.navigate(['/import-wallet']);
  }

  private setActiveWallet(chxAddress: string) {
      const walletInfoPromise = this.walletService.getWalletInfo(chxAddress);
      if (walletInfoPromise) {
          walletInfoPromise.subscribe((walletInfo) => {
              this.selectWallet(walletInfo);
              if (this.selectedWallet) {
                  this.privateKeyService.setWalletInfo(this.selectedWallet);
                  this.privateKeyService.sendMessage(this.privateKeyService.existsKey());
              }
          });
      } else {
          this.privateKeyService.setWalletInfo(null);
          this.privateKeyService.sendMessage(false);
      }
  }

  onChxAddressChange(address: string) {
      this.selectedChxAddress = address;
      this.setActiveWallet(this.selectedChxAddress);
  }

  onRemovePrivateAddress() {
      if (this.selectedChxAddress) {
          if (this.chxAddresses.indexOf(this.selectedChxAddress) === -1) {
              this.selectedChxAddress = this.chxAddresses[0];
              this.setActiveWallet(this.selectedChxAddress);
              this.router.navigate(['/home']);
          }
      }
  }

  /*
  openPrivateKeyDialog() {
      this.dialog.open(CopyPrivateKeyComponent, {
          width: '50%', data: this.selectedWallet
      });
  } */

  private populateAddresses(): Observable<ChxAddressInfo[]> {
    return from(this.chxAddresses).pipe(
      mergeMap(address => this.nodeService.getAddressInfo(address))
    );
  }

  private setAddress(addr: any): void {
      this.nodeService
      .getAddressInfo(this.privateKeyService.getWalletInfo().address)
      .subscribe(address => {
          if (!address || address.errors) {
              this.privateKeyService.setWalletInfo(null);
              this.addressInfo = null;
              return;
          }
          this.addressInfo = address;
      });
  }

  private selectWallet(walletInfo: WalletInfo) {

      this.selectedWallet = walletInfo;
      this.selectedChxAddress = this.selectedWallet ? this.selectedWallet.address : null;

      if (!this.selectedChxAddress) {
          this.selectedChxAddress = this.walletService.getSelectedChxAddress();
      }
      if (this.selectedChxAddress) {
          this.walletService.setSelectedChxAddress(this.selectedChxAddress);
      }
  }

  private validateWalletContext() {
      const walletContext = this.walletService.getWalletContext();
     this.isWalletContextValid = walletContext.passwordHash != null && walletContext.walletKeystore != null;
  }

}
