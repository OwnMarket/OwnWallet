import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { ChxAddressInfo } from "../models/chx-address-info.model";

@Injectable()
export class StateService {
  private totalBalanceSubj: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );
  public totalBalance$: Observable<number> = this.totalBalanceSubj.asObservable();

  private addressInfosSubj: BehaviorSubject<
    ChxAddressInfo[]
  > = new BehaviorSubject<ChxAddressInfo[]>([]);

  public addressInfos$: Observable<
    ChxAddressInfo[]
  > = this.addressInfosSubj.asObservable();

  setBalance(value: number) {
    this.totalBalanceSubj.next(value);
  }

  getBalance(addressInfos: ChxAddressInfo[]): number {
    return addressInfos.reduce(
      (curr: number, next: ChxAddressInfo) => curr + next.balance.available,
      0
    );
  }

  setAddressInfos(addressInfos: ChxAddressInfo[]) {
    this.addressInfosSubj.next(addressInfos);
    this.totalBalanceSubj.next(this.getBalance(addressInfos));
  }
}
