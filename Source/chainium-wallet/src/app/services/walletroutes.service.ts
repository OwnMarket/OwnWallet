import { WalletRouteInfo } from '../models/wallet-route-info.model';
import { Injectable } from '@angular/core';

const ROUTES: WalletRouteInfo[] = [
  { route: 'wallet', linkText: 'Generate wallet', icon: 'library_add' },
  { route: 'importwallet', linkText: 'Import wallet', icon: 'account_balance_wallet' },
  { route: 'address', linkText: 'Address info', icon: 'markunread_mailbox' },
  //{ route: 'generateaccount', linkText: 'Generate account', icon: 'how_to_reg' },
  { route: 'account', linkText: 'Account info', icon: 'person' },
  { route: 'asset', linkText: 'Asset info', icon: 'insert_drive_file' },
  { route: 'submit-tx', linkText: 'Submit transaction', icon: 'next_week' },
  { route: 'tx', linkText: 'Transaction info', icon: 'import_export' },
  { route: 'block', linkText: 'Block info', icon: 'widgets ' },
  { route: 'validator', linkText: 'Validator info', icon: 'gavel' },
  { route: 'sign-verify', linkText: 'Message Signing and Verification', icon: 'verified_user' },
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
