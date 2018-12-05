export class BlockInfo {
    number: number;
    hash: string;
    previousHash: string;
    timestamp: number;
    blockTime: string; // Doesn't come from the API
    validator: string;
    txSetRoot: string;
    txResultSetRoot: string
    stateRoot: string;
    txSet: string[];
}