import { WalletRouteInfo } from '../models/wallet-route-info.model';
import { Injectable } from '@angular/core';

const ROUTES: WalletRouteInfo[] = [
    { route: '/address', linkText: 'Address info', icon: 'markunread_mailbox' },
    //{ route: '/generateaccount', linkText: 'Generate account', icon: 'how_to_reg' },
    { route: '/account', linkText: 'Account info', icon: 'person' },
    { route: '/asset', linkText: 'Asset info', icon: 'insert_drive_file' },
    { route: '/submit-tx', linkText: 'Submit transaction', icon: 'next_week' },
    { route: '/tx', linkText: 'Transaction info', icon: 'import_export' },
    { route: '/block', linkText: 'Block info', icon: 'widgets ' },
    { route: '/validator', linkText: 'Validator info', icon: 'gavel' },
    { route: '/sign-verify', linkText: 'Message Signing and Verification', icon: 'verified_user' },
];

@Injectable({
    providedIn: 'root'
})
export class WalletRoutes {

    constructor() { }

    public getRoutes(walletExists: boolean): WalletRouteInfo[] {    
        var routes = [...ROUTES];
        if (walletExists) {
            var unloadWalletRoute = { route: '/unloadWallet', linkText: 'Unload Wallet', icon: 'remove_circle'};      
            routes.unshift(unloadWalletRoute);
        } 
        else {
            var createWalletRoute = { route: '/createWallet', linkText: 'Create Wallet', icon: 'add_circle' };
            var restoreWalletRoute = { route: '/restoreWallet', linkText: 'Restore Wallet', icon: 'restore' };
            routes.unshift(createWalletRoute, restoreWalletRoute);
        }
        return routes;
    }  
}
