import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

import { ApiResponse } from "../models/api-response.model";
import { ChxAddressInfo } from "../models/chx-address-info.model";
import { ConfigurationService } from "./configuration.service";

@Injectable()
export class StateService {
  private totalBalanceSubj: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public totalBalance$: Observable<number> = this.totalBalanceSubj.asObservable();
  private totalUsdBalanceSubj: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public totalUsdBalance$: Observable<number> = this.totalUsdBalanceSubj.asObservable();

  private usdToChxRatioSubj: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public usdToChxRatio$: Observable<number> = this.usdToChxRatioSubj.asObservable();

  private addressInfosSubj: BehaviorSubject<
    ChxAddressInfo[]
  > = new BehaviorSubject<ChxAddressInfo[]>([]);
  public addressInfos$: Observable<
    ChxAddressInfo[]
  > = this.addressInfosSubj.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {}

  setBalance(value: number) {
    this.totalBalanceSubj.next(value);
  }

  getBalance(addressInfos: ChxAddressInfo[]): number {
    return addressInfos.reduce(
      (curr: number, next: ChxAddressInfo) => curr + next.balance.available,
      0
    );
  }

  getTotalUsdBalance(
    balance: number,
    baseCurrency: string = "CHX",
    quoteCurrency: string = "USD"
  ) {
    this.http
      .get<ApiResponse<number>>(
        `${this.configService.config.bridgeApiUrl}/rate/${baseCurrency}/${quoteCurrency}`
      )
      .subscribe((resp) => {
        this.usdToChxRatioSubj.next(resp.data);
        this.totalUsdBalanceSubj.next(balance * resp.data);
      });
  }

  setAddressInfos(addressInfos: ChxAddressInfo[]) {
    this.addressInfosSubj.next(addressInfos);
    this.totalBalanceSubj.next(this.getBalance(addressInfos));
    //this.getTotalUsdBalance(this.getBalance(addressInfos));
  }
}
