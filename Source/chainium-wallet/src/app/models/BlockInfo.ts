export class BlockInfo {
    number: number;
    hash: string;
    previousHash: string;
    timestamp: number;
    validator: string;
    txSetRoot: string;
    txResultSetRoot: string
    stateRoot: string;
    txSet: string[];
}