import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { WalletRoutes } from '../services/walletroutes.service';
import { PrivatekeyService } from '../services/privatekey.service';
import { WalletRouteInfo } from '../models/wallet-route-info.model';

@Component({
    selector: 'app-layout',
    templateUrl: './private.component.html',
    styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnDestroy {

    routes: WalletRouteInfo[];
    displayBalanceInfo: boolean;
    balanceChangeSubscription: Subscription;
    constructor(
        private routeService: WalletRoutes,
        private privateKeyService: PrivatekeyService) {
        this.routes = this.routeService.getRoutes();

        this.balanceChangeSubscription = this.privateKeyService
            .getMessage()
            .subscribe(message => this.displayBalanceInfo = message);
    }


    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.balanceChangeSubscription.unsubscribe();
    }
}
