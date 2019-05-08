import { TxAction } from "./submit-transactions.model";

export class TransactionInfo { 
    txHash : string;
    senderAddress : string;
    nonce : number;
    expirationTime : number;
    actionFee : number;
    actions : TxAction[];
    status : string;
    errorCode : string;
    failedActionNumber : number;
    includedInBlockNumber: number;
}