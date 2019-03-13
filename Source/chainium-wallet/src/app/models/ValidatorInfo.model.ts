export class ValidatorsInfo {
    validators: [ValidatorInfo]
}

export class ValidatorInfo {
    validatorAddress: string;
    networkAddress: string;
    sharedRewardPercent: number;
    isActive: boolean;
}
