export class TxAction {
    actionType: string;
    actionData: object;
}

export class Tx {
    senderAddress: string;
    nonce: number;
    actionFee: number;
    actions: TxAction[];
}

export class TxEnvelope {
    tx: string;
    signature: string;
}

export class TxResult {
    txHash: string;
}

//#region Network Management Actions
export class ChxTransfer {
    recipientAddress: string;
    amount: number;
    constructor(recipientAddress?: string, amount?: number) {
      this.recipientAddress = recipientAddress;
      this.amount = amount;
    }
}

export class DelegateStake {
    validatorAddress: string;
    amount: number;
}

export class ConfigureValidator {
    networkAddress: string;
    sharedRewardPercent: number;
    isEnabled: boolean;
    constructor(networkAddress?: string, sharedRewardPercent?: number, isEnabled?: boolean) {
      this.networkAddress = networkAddress;
      this.sharedRewardPercent = sharedRewardPercent;
      this.isEnabled = isEnabled;
    }
}

export class RemoveValidator {
}
//#endregion Network Management Actions

//#region Asset Management Actions
export class AssetTransfer {
    fromAccountHash: string;
    toAccountHash: string;
    assetHash: string;
    amount: number;
}

export class CreateAssetEmission {
    emissionAccountHash: string;
    assetHash: string;
    amount: number;
}

export class CreateAsset {
}

export class SetAssetCode {
    assetHash: string;
    assetCode: string;
}

export class SetAssetController {
    assetHash: string;
    controllerAddress: string;
}

export class CreateAccount {
}

export class SetAccountController {
    accountHash: string;
    controllerAddress: string;
}
//#endregion Asset Management Actions

//#region Voting Actions
export class SubmitVote {
    accountHash: string;
    assetHash: string;
    resolutionHash: string;
    voteHash: string;
}

export class SubmitVoteWeight {
    accountHash: string;
    assetHash: string;
    resolutionHash: string;
    voteWeight: number;
}
//#endregion Voting Actions
