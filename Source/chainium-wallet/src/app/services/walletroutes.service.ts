import { WalletRouteInfo } from '../models/wallet-route-info.model';
import { Injectable } from '@angular/core';

const ROUTES: WalletRouteInfo[] = [
  { route: 'wallet', linkText: 'Generate wallet', icon: 'library_add' },
  { route: 'importwallet', linkText: 'Import wallet', icon: 'account_balance_wallet' },
  { route: 'addressinfo', linkText: 'Address info', icon: 'markunread_mailbox' },
  { route: 'assetInfo', linkText: 'Asset info', icon: 'insert_drive_file' },
  //{ route: 'generateaccount', linkText: 'Generate account', icon: 'how_to_reg' },
  { route: 'accountinfo', linkText: 'Account info', icon: 'person' },
  { route: 'submissions', linkText: 'Submit transaction', icon: 'next_week' },
  { route: 'transaction', linkText: 'Transaction info', icon: 'import_export' },
  { route: 'block', linkText: 'Block info', icon: 'widgets ' },
  { route: 'validatorInfo', linkText: 'Validator info', icon: 'gavel' },
  { route: 'messageSigningVerification', linkText: 'Message Signing and Verification', icon: 'gavel' },
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
