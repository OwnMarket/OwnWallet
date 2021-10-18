import { BridgedToken } from './bridged-token.model';

export interface BridgeAsset {
  assetHash: string;
  assetCode: string;
  bridgedTokens: BridgedToken[];
}
