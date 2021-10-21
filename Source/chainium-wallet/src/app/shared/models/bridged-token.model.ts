export interface BridgedToken {
  targetBlockchain: string;
  tokenAddress: string;
  accountHash?: string;
  ownerChxAddress?: string;
  mappingContract?: string;
}
