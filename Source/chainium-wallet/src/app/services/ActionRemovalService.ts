import { TxAction, Tx } from "../models/SubmitTransactions";

export interface ActionRemoval{
    tx : Tx;
    removeAction(txAction : object) : void;
}
