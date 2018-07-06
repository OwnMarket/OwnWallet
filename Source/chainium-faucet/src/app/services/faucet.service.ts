import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FaucetService {
  private baseServiceUrl: string;

  constructor(private http: HttpClient) {
    this.baseServiceUrl = environment.faucetApiUrl;
  }

  public claimChx(chxAddress: string): Observable<any> {
    const claimChxUrl = `${this.baseServiceUrl}/chx`;
    const data = {chainiumAddress : chxAddress};
    return this.http.post(claimChxUrl, data);
  }

  public claimAsset(accountHash: string): Observable<any> {
    const claimAssetUrl = `${this.baseServiceUrl}/asset`;
    const data = {accountHash : accountHash};
    return this.http.post<any>(claimAssetUrl, data);
  }
}
