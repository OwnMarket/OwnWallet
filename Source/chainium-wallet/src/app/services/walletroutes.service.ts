import { WalletRouteInfo } from '../models/WalletRouteInfo';
import { Injectable } from '@angular/core';

const ROUTES: WalletRouteInfo[] = [
  { route: 'wallet', linkText: 'Generate wallet', icon: 'library_add' },
  { route: 'importwallet', linkText: 'Import wallet', icon: 'account_balance_wallet' },
  { route: 'addressinfo', linkText: 'Address info', icon: 'info' },
  { route: 'generateaccount', linkText: 'Generate account', icon: 'how_to_reg' },
  { route: 'accountinfo', linkText: 'Account info', icon: 'info' },
  { route: 'submissions', linkText: 'Submit transaction', icon: 'next_week' },
  { route: 'transaction', linkText: 'Transaction info', icon: 'info' },
  { route: 'block', linkText: 'Block info', icon: 'info' }
];


@Injectable({
  providedIn: 'root'
})
export class WalletRoutes {

  constructor() { }

  public getRoutes(): WalletRouteInfo[] {
    return ROUTES;
  }
}
