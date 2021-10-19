export interface BridgedToken {
  targetBlockchain: number;
  tokenAddress: string;
  accountHash?: string;
  ownerChxAddress?: string;
  mappingContract?: string;
}
