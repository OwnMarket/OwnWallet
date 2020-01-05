export class StakesInfo {
    stakes: StakeInfo[];
}

export class StakeInfo {
    stakerAddress: string;
    amount: number;
}

export interface MyStakeInfo {
  validatorAddress: string;
  amount: number;
}

export interface MyStakes {
  stakes: MyStakeInfo[];
}
