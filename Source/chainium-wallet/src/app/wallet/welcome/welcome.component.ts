import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterEvent, RouterOutlet } from '@angular/router';

import { ChxAddressInfo } from 'src/app/shared/models/chx-address-info.model';
import { WalletInfo } from 'src/app/shared/models/wallet-info.model';

import { CryptoService } from 'src/app/shared/services/crypto.service';
import { PrivatekeyService } from 'src/app/shared/services/privatekey.service';
import { WalletService } from 'src/app/shared/services/wallet.service';
import { NodeService } from 'src/app/shared/services/node.service';

import { OwnAnimations } from '../../shared';
import { OwnSliderComponent } from 'src/app/shared/own-slider/own-slider/own-slider.component';
import { OwnModalService } from 'src/app/shared/own-modal/services/own-modal.service';
import { OwnDropdownMenuComponent } from 'src/app/shared/own-dropdown-menu/own-dropdown-menu/own-dropdown-menu.component';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { forkJoin, Subscription, timer } from 'rxjs';
import { StateService } from 'src/app/shared/services/state.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [OwnAnimations.flyDown, OwnAnimations.flyUp, OwnAnimations.flyUpDown],
})
export class WelcomeComponent implements OnInit, OnDestroy {
  addressInfo: ChxAddressInfo;
  addressInfos: ChxAddressInfo[] = [];
  selectedWallet: WalletInfo;
  selectedChxAddress: string;
  chxAddresses: string[] = [];
  showImportedPk: boolean;
  isWalletContextValid: boolean;
  showAdvanced = false;
  explorerUrl: string;
  chxToUsdRate: number;

  selectedSlideIndex: number = 0;
  routerSub: Subscription;
  fetchChxToUsdSub: Subscription;
  fetchAddressInfosSub: Subscription;

  constructor(
    private router: Router,
    private cryptoService: CryptoService,
    private privateKeyService: PrivatekeyService,
    private walletService: WalletService,
    private ownModalService: OwnModalService,
    private nodeService: NodeService,
    private state: StateService,
    private configService: ConfigurationService
  ) {}

  ngOnInit() {
    this.explorerUrl = this.configService.config.explorerUrl;
    this.fetchChxToUsdRatio();
    this.privateKeyService.getMessage().subscribe((msg) => {
      this.onRefreshAddressInfoClick();
    });
    this.walletService.getMessage().subscribe(() => {
      this.validateWalletContext();
    });
    this.walletService.generateWalletFromContext();
    this.showAdvanced = false;

    this.routerSub = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (this.router.url === event.url) {
          this.router.navigate(['/wallet']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.fetchChxToUsdSub) this.fetchChxToUsdSub.unsubscribe();
    if (this.fetchAddressInfosSub) this.fetchAddressInfosSub.unsubscribe();
    if (this.routerSub) this.routerSub.unsubscribe();
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
      .subscribe((addr) => this.setAddress(addr));
    this.fetchAddressInfos();
  }

  onAddChxAddressClick(slider: OwnSliderComponent) {
    this.walletService.createNewChxAddress();
    this.chxAddresses = this.walletService.getAllChxAddresses();
    const index = this.chxAddresses.length - 1;
    const addr = this.chxAddresses[index];
    slider.goTo(index);
    this.setActiveWallet(addr);
    this.router.navigate(['/wallet']);
  }

  fetchChxToUsdRatio() {
    this.fetchChxToUsdSub = timer(1000, 240000)
      .pipe(mergeMap(() => this.state.getChxToUsdRate()))
      .subscribe((rate) => {
        if (this.chxToUsdRate !== rate) {
          this.chxToUsdRate = rate;
        }
      });
  }

  fetchAddressInfos() {
    const requests = [];
    this.chxAddresses.forEach((address) => {
      requests.push(this.nodeService.getAddressInfo(address));
    });

    if (this.fetchAddressInfosSub) this.fetchAddressInfosSub.unsubscribe();

    this.fetchAddressInfosSub = timer(1000, 30000)
      .pipe(mergeMap(() => forkJoin(requests)))
      .subscribe((resp: ChxAddressInfo[]) => {
        if (JSON.stringify(this.addressInfos) !== JSON.stringify(resp)) {
          this.addressInfos = resp;
          this.state.setAddressInfos(this.addressInfos);
        }
      });
  }

  getInfoForAddress(chxAddress: string): ChxAddressInfo {
    return this.addressInfos.find((info) => info.blockchainAddress === chxAddress);
  }

  onImportPrivateKeyClick() {
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

  onChxAddressChange(address: string, slider: OwnSliderComponent, index: number) {
    slider.goTo(index);
    this.selectedChxAddress = address;
    this.setActiveWallet(this.selectedChxAddress);
    this.router.navigate(['/wallet']);
    this.showAdvanced = false;
  }

  onRemovePrivateAddress() {
    if (this.selectedChxAddress) {
      if (this.chxAddresses.indexOf(this.selectedChxAddress) === -1) {
        this.selectedChxAddress = this.chxAddresses[0];
        this.setActiveWallet(this.selectedChxAddress);
        this.router.navigate(['/wallet']);
      }
    }
  }

  private setAddress(addr: any): void {
    this.nodeService.getAddressInfo(this.privateKeyService.getWalletInfo().address).subscribe((address) => {
      if (!address) {
        this.privateKeyService.setWalletInfo(null);
        this.addressInfo = null;
        return;
      }
      this.addressInfo = address;
      if (this.chxAddresses.length === 0) {
        this.chxAddresses.push(address.blockchainAddress);
      }
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

  getState(outlet: RouterOutlet) {
    return outlet.activatedRouteData.state;
  }

  openModal(id: string, menu: OwnDropdownMenuComponent) {
    this.ownModalService.open(id);
    menu.isActive = false;
  }

  hidePrivateKey(id: string) {
    this.ownModalService.close(id);
  }
}
