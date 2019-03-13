export class BlockInfo {
    number: number;
    hash: string;
    configuration: BlockConfiguration;
    configurationBlockNumber: number;
    configurationRoot: string;
    consensusRound: number;
    previousHash: string;
    timestamp: number;
    blockTime: string; // Doesn't come from the API
    txSet: string[];
    txSetRoot: string;
    txResultSetRoot: string
    stateRoot: string;
    equivocationProofs: string[];
    equivocationProofsRoot: string;
    equivocationProofResultsRoot: string;
    stakingRewards: string[];
    stakingRewardsRoot: string;
}

export class BlockConfiguration {
    configurationBlockDelta: number;
    maxTxCountPerBlock: number;
    validatorBlacklistTime: number;
    validatorDepositLockTime: number;
    validators: string[];
}