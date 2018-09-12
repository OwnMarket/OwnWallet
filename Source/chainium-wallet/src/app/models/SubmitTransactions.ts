export class TxEnvelope {
    tx: string;
    signature: string;
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
    senderAddress: string;
    nonce: number;
    fee: number;
    actions: TxAction[];
}
