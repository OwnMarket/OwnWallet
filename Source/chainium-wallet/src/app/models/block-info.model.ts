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
    proposerAddress: string;
    txSetRoot: string;
    txResultSetRoot: string
    stateRoot: string;
    equivocationProofs: string[];
    equivocationProofsRoot: string;
    equivocationProofResultsRoot: string;
    stakingRewards: StakerReward[];
    stakingRewardsRoot: string;
}

export class StakerReward { 
    stakerAddress: string;
    amount: number; 
}

export class BlockConfiguration {
    configurationBlockDelta: number;
    validators: BlockConfigurationValidator[];
    validatorsBlackList: string [];
    validatorDepositLockTime: number;
    validatorBlacklistTime: number;
    maxTxCountPerBlock: number;
}

export class BlockConfigurationValidator {
    validatorAddress: string;
    networkAddress: string;
    sharedRewardPercent: number;
    totalStake: number;
}