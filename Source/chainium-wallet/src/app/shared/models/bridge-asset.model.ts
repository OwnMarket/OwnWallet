import { BridgedToken } from './bridged-token.model';

export interface BridgeAsset {
  assetCode: string;
  assetHash?: string;
  bridgedTokens: BridgedToken[];
}
