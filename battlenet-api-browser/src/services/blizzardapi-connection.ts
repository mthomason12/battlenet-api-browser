import { BlizzAPI, RegionIdOrName, ResponseError } from "blizzapi";
import { APIConnection } from "../lib/apiconnection";
import { userDataStruct } from "../model/userdata";

export class BlizzardAPIConnection extends APIConnection {

    blizzapi: BlizzAPI;
    region: RegionIdOrName;
    data: userDataStruct;

    constructor(data: userDataStruct) {
        super();
        this.data = data;
        this.region = "us";
        this.blizzapi = new BlizzAPI({
            region: this.region!,
            clientId: this.data.key.clientID,
            clientSecret: this.data.key.clientSecret
        });  
    }

    override getAccessToken(): Promise<string> {
        return this.blizzapi.getAccessToken();
    }

    override setAccessToken(token: string) {
        //replace blizzapi with one using our new access token
        this.blizzapi = new BlizzAPI({
            region: this.region!,
            clientId: this.data.key.clientID,
            clientSecret: this.data.key.clientSecret,
            accessToken: token
        });  
    }

    override apiCall<T = any>(apiEndpoint: string, params: string, options: object): Promise<T | undefined> {
        return this.blizzapi.query(apiEndpoint, {}) as Promise <T | undefined>;
    }

}