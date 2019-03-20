export class ChxAddressInfo {
    blockchainAddress: string;
    balance: AddressBalance;
    nonce: number;
}

export class AddressBalance {
    available: number;
    deposit: number;
    staked: number;
    total: number;
}
