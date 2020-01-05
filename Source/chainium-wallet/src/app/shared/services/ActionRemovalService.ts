import { Tx } from "../models/submit-transactions.model";

export interface ActionRemoval{
    tx : Tx;
    removeAction(txAction : object) : void;
}
