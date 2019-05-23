import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../services/wallet.service';

@Component({
    selector: 'app-unload-wallet',
    templateUrl: './unload-wallet.component.html'
})
export class UnloadWalletComponent implements OnInit {

    constructor(private router: Router,
        private walletService: WalletService) { }

    ngOnInit() {
        this.walletService.unloadWallet();
        this.router.navigate(['/home']);
    }
}
