import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { PrivatekeyService } from '../services/privatekey.service';
import { CryptoService } from '../services/crypto.service';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss']

})
export class LandingComponent implements OnInit {
    returnUrl: string;
    visibleNewWallet: boolean = false;
    visibleRestoreWallet: boolean = false;
    needPasswordOnly: boolean = false;

    walletKeystore: string;

    password = new FormControl('', [Validators.required]);

    constructor(private router: Router,
        private cryptoService: CryptoService,
        private privateKeyService: PrivatekeyService,
        private walletService: WalletService) {
        this.returnUrl = '/home';
    }

    ngOnInit() {

        if (localStorage.walletKeystore) {
            this.needPasswordOnly = true;
            this.walletKeystore = localStorage.walletKeystore;
        }
    }

    onSubmitPassword() {
        this.password.markAsTouched();
        if (this.password.valid && this.walletKeystore) {
            this.getSeedFromKeyStore({ walletKeystore: this.walletKeystore, password: this.password.value });
        }
    }

    getSeedFromKeyStore({ walletKeystore, password }) {
        if (walletKeystore && password) {
            this.cryptoService.generateSeedFromKeyStore(walletKeystore, password)
                .subscribe((seed: string) => {
                    if (seed) {
                        this.setSeed(seed, walletKeystore);
                    }
                });
        }
    }

    getSeedFromMnemonic({ mnemonic, password }) {
        if (mnemonic && password) {
            this.cryptoService.generateSeedFromMnemonic(mnemonic, password)
                .subscribe((seed: string) => {
                    if (seed) {
                        this.cryptoService.generateWalletKeystore(mnemonic, password)
                            .subscribe((walletKeystore: string) => {
                                this.setSeed(seed, walletKeystore);
                            });
                    }
                });
        }
    }


    private setSeed(seed, walletKeystore) {
        this.privateKeyService.seed = seed;
        this.privateKeyService.sendMessage(this.privateKeyService.existsSeed());

        let walletCount = JSON.parse(localStorage.walletCount || 0);


        if (walletKeystore !== localStorage.walletKeystore) {
            walletCount = 0;
        }

        if (walletCount > 0) {
            this.cryptoService.restoreWalletsFromSeed(seed, walletCount)
                .subscribe((result: any) => {
                    this.walletService.wallets = result;
                    this.walletService.sendMessage(this.walletService.existsWallet());
                });
        }

        localStorage.walletCount = walletCount;
        localStorage.walletKeystore = walletKeystore;
        this.router.navigate(['/home']);
    }

    showNewWallet() {
        this.visibleRestoreWallet = false;
        this.visibleNewWallet = true;
    }

    showRestoreWallet() {
        this.visibleNewWallet = false;
        this.visibleRestoreWallet = true;
    }
}