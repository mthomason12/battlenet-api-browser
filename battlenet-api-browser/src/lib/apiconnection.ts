import { Router } from "@angular/router";
import { apiClientSettings } from "../services/apiclientsettings";
import { HttpClient } from "@angular/common/http";
import { extensionDataStruct } from "../model/userdata";

/**
 * New forms of API connection (e.g. via a proxy, an SSH tunnel, or an encrypted IP stream) should
 * inherit from this.
 */
export abstract class APIConnection {

    settings: extensionDataStruct;
    protected httpClient: HttpClient;

    protected _loggedIn = false;
    protected _loggingIn = false;
    protected _connected = false;

    protected _name: string = "Unnamed Connection";

    constructor (settings: extensionDataStruct, httpClient: HttpClient, name: string)
    {
        this.settings = settings;
        this.httpClient = httpClient;
        this._name = name;
    }

    isConnected(): boolean {
        return this._connected;
    }
    
    isLoggingIn(): boolean {
        return this._loggingIn;
    }

    isLoggedIn(): boolean {
        return this._loggedIn;
    }

    getName(): string {
        return this._name;
    }

    /**
     * Override to return true if preconditions are met for a connection attempt.
     * For example, check that there's an API Key and Secret configured.
     * @returns 
     */
    canConnect(): boolean {
        return false;
    }

    /**
     * Override to perform any connection code necessary.
     * Should reject the promise if connection is not possible.
     * @returns 
     */
    connect(): Promise<void> {
        return Promise.resolve();
    }


    provideSettings(extSettings: extensionDataStruct): void{
        this.settings = extSettings;
        this.settingsChanged();
    }

    /** Override in descendants to do whatever needs doing if settings have been changed */
    settingsChanged(): void {

    }

    /**
     * Override for signin redirection processing
     * @returns
     */
    signinRedirect(): Promise<void> {
        return new Promise<void>((resolve)=>{
            resolve();
        });
    }

    completeAuthentication(authcode: string, router: Router): void {}

    /**
     * Execute API call
     * @param apiEndpoint 
     * @param params 
     * @param options 
     */
    abstract apiCall<T = any>(apiEndpoint: string, params: string, options: object): Promise<T | undefined>

}