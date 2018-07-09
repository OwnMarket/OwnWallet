export class TxEnvelope {
    tx: string;
    v: string;
    r: string;
    s: string;
}

export class TxResult {
    txHash: string;
}

export class ChxTransfer {
    recipientAddress: string;
    amount: number;
}

export class AssetTransfer {
    fromAccount: string;
    toAccount: string;
    assetHash: string;
    amount: number;
}

export class TxAction {
    actionType: string;
    actionData: object;
}

export class Tx {
    nonce: number;
    fee: number;
    senderAddress: string;
    actions: TxAction[];
}
