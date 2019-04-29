export class EquivocationProofInfo {
    equivocationProofHash: string;
    validatorAddress: string;
    blockNumber: number;
    consensusRound: number;
    consensusStep: number;
    equivocationValue1: string;
    equivocationValue2: string;
    signature1: string;
    signature2: string;
    depositTaken: number;
    depositDistribution: DepositDistribution [];
    includedInBlockNumber: number;
}

export class DepositDistribution {
    validatorAddress: string;
    amount: number;
}