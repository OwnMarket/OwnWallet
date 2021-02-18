import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response.model';
import { BridgeFee } from '../models/bridge-fee.model';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class ChxBridgeFeeService {
  private httpHandler: HttpClient;
  constructor(private handler: HttpBackend, private configService: ConfigurationService) {
    this.httpHandler = new HttpClient(handler);
  }

  getBridgeFees(ethAddress: string, type: string): Observable<ApiResponse<BridgeFee>> {
    const params = new HttpParams().append('ethAddress', ethAddress).append('transferType', type);
    return this.httpHandler.get<ApiResponse<BridgeFee>>(`${this.configService.config.bridgeApiUrl}/fee`, {
      params,
    });
  }
}
