import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiResponse } from "../models/api-response.model";
import { BridgeFee } from "../models/bridge-fee.model";
import { ConfigurationService } from "./configuration.service";

@Injectable({
  providedIn: "root",
})
export class ChxBridgeFeeService {
  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {}

  getBridgeFees(
    ethAddress: string,
    type: string
  ): Observable<ApiResponse<BridgeFee>> {
    const params = new HttpParams()
      .append("ethAddress", ethAddress)
      .append("transferType", type);
    return this.http.get<ApiResponse<BridgeFee>>(
      `${this.configService.config.bridgeApiUrl}/fee`,
      {
        params,
      }
    );
  }
}
