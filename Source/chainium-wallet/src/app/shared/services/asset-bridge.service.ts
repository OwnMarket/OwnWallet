import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { Observable } from 'rxjs';
import { BridgeAsset } from '../models/bridge-asset.model';

@Injectable({ providedIn: 'root' })
export class AssetBridgeService {
  private httpHandler: HttpClient;

  constructor(private handler: HttpBackend, private configService: ConfigurationService) {
    this.httpHandler = new HttpClient(handler);
  }

  getAssets(): Observable<BridgeAsset[]> {
    return this.httpHandler.get<BridgeAsset[]>(`${this.configService.config.bridgeApiUrl}/assets`);
  }

  getABI(targetBlockchain: string, tokenAddress: string): Observable<string> {
    return this.httpHandler.get<string>(
      `${this.configService.config.bridgeApiUrl}/${targetBlockchain}/${tokenAddress}/abi`
    );
  }
}
