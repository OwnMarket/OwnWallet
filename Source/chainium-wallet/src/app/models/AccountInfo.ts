export class Holding {
    assetHash: string;
    balance: number;
}

export class AccountInfo {
    accountHash: string;
    controllerAddress: string;
    holdings: Holding[];
}