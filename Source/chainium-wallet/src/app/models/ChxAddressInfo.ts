export class ChxAddressInfo {
    chainiumAddress: string;
    balance: AddressBalance;
    nonce: number;
}

export class AddressBalance {
    available: number;
    deposit: number;
    staked: number;
    total: number;
}
