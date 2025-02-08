import { APIConnection } from "../lib/apiconnection";

export class BlizzardAPIConnection extends APIConnection {
    override connect(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    override authenticate(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    override apiCall<T = any>(apiEndpoint: string, params: string, options: object): Promise<T | undefined> {
        throw new Error("Method not implemented.");
    }

}