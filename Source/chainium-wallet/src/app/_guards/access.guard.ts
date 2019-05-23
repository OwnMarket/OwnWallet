import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { PrivatekeyService } from '../services/privatekey.service';
import { WalletService } from '../services/wallet.service';

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
    constructor(
        private router: Router,
        private walletService: WalletService,
        private privateKeyService: PrivatekeyService
    ) { }

    canActivate() {
        var context = this.walletService.getWalletContext();
        if (!context.passwordHash && context.walletKeystore) {
            this.router.navigate(['/landing']);
            return false;
        }                
        
        return true;
    }
}