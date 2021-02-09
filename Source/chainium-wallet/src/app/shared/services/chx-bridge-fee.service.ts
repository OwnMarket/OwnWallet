import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { ApiResponse } from "../models/api-response.model";
import { BridgeFee } from "../models/bridge-fee.model";

@Injectable({
  providedIn: "root",
})
export class ChxBridgeFeeService {
  constructor(private http: HttpClient) {}

  getBridgeFees(
    ethAddress: string,
    type: string
  ): Observable<ApiResponse<BridgeFee>> {
    const params = new HttpParams()
      .append("ethAddress", ethAddress)
      .append("transferType", type);
    return this.http.get<ApiResponse<BridgeFee>>(
      `${environment.bridgeApiUrl}/fee`,
      {
        params,
      }
    );
  }
}
