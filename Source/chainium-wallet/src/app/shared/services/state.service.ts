import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../models/api-response.model';
import { ChxAddressInfo } from '../models/chx-address-info.model';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class StateService {
  private httpHandler: HttpClient;

  private totalBalanceSubj: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public totalBalance$: Observable<number> = this.totalBalanceSubj.asObservable();

  private usdToChxRateSubj: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public usdToChxRate$: Observable<number> = this.usdToChxRateSubj.asObservable();

  private addressInfosSubj: BehaviorSubject<ChxAddressInfo[]> = new BehaviorSubject<ChxAddressInfo[]>([]);
  public addressInfos$: Observable<ChxAddressInfo[]> = this.addressInfosSubj.asObservable();

  private refreshInfosSubj: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public refreshInfos$: Observable<boolean> = this.refreshInfosSubj.asObservable();

  constructor(private handler: HttpBackend, private configService: ConfigurationService) {
    this.httpHandler = new HttpClient(handler);
  }

  setBalance(value: number) {
    this.totalBalanceSubj.next(value);
  }

  getBalance(addressInfos: ChxAddressInfo[]): number {
    return addressInfos.reduce((curr: number, next: ChxAddressInfo) => curr + next.balance.total, 0);
  }

  getTotalUsdBalance(): Observable<number> {
    return combineLatest([this.totalBalance$, this.usdToChxRate$]).pipe(map(([balance, rate]) => balance * rate));
  }

  getChxToUsdRate(baseCurrency: string = 'CHX', quoteCurrency: string = 'USD'): Observable<number> {
    return this.httpHandler
      .get<ApiResponse<number>>(`${this.configService.config.bridgeApiUrl}/rate/${baseCurrency}/${quoteCurrency}`)
      .pipe(
        map((resp) => {
          this.usdToChxRateSubj.next(resp.data);
          return resp.data;
        })
      );
  }

  setAddressInfos(addressInfos: ChxAddressInfo[]) {
    this.addressInfosSubj.next(addressInfos);
    this.totalBalanceSubj.next(this.getBalance(addressInfos));
  }

  refresh() {
    this.refreshInfosSubj.next(true);
  }

  endRefresh() {
    this.refreshInfosSubj.next(false);
  }
}
