import { TxAction } from "./SubmitTransactions";

export class TransactionInfo { 
    txHash : string;
    senderAddress : string;
    nonce : number;
    actionFee : number;
    actions : TxAction[];
    status : string;
    errorCode : string;
    failedActionNumber : number;
    includedInBlockNumber: number;
}