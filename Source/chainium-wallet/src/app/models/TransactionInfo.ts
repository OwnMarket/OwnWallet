import { TxAction } from "./SubmitTransactions";

export class TransactionInfo { 
    txHash : string;
    senderAddress : string;
    nonce : number;
    fee : number;
    actions : TxAction[];
    status : string;
    errorCode : string;
    failedActionNumber : number;
    blockNumber : number;   
}