export class SigningRequest {
    privateKey : string;
    dataToSign : string;
}

export class Signature {
    v : string;
    r : string;
    s : string;
}