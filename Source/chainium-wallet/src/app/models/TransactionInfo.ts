import { TxAction } from "./SubmitTransactions";

export class TransactionInfo { 
    txHash : string;
    senderAddress : string;
    nonce : number;
    fee : number;
    actions : TxAction[];
    status : number;
    errorCode : number;
    failedActionNumber : number;
    blockNumber : number;   
}