import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { PrivatekeyService } from '../services/privatekey.service';

@Injectable({ providedIn: 'root' })
export class AccessGuard implements CanActivate {
    constructor(
        private router: Router,
        private privateKeyService: PrivatekeyService
    ) { }

    canActivate() {
        const isSeedImported = this.privateKeyService.existsSeed();

        if (isSeedImported) {
            return true;
        }

        this.router.navigate(['/landing']);
        return false;
    }
}