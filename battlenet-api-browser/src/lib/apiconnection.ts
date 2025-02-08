import { Router } from "@angular/router";
import { apiClientSettings } from "../services/apiclientsettings";
import { HttpClient } from "@angular/common/http";

/**
 * New forms of API connection (e.g. via a proxy, an SSH tunnel, or an encrypted IP stream) should
 * inherit from this.
 */
export abstract class APIConnection {

    settings?: apiClientSettings;
    protected httpClient: HttpClient;

    protected _loggedIn = false;
    protected _loggingIn = false;
    protected _connected = false;

    constructor (settings: apiClientSettings | undefined, httpClient: HttpClient)
    {
        this.settings = settings;
        this.httpClient = httpClient;
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

    /**
     * Override to perform any connection code necessary.
     * @returns 
     */
    connect(): Promise<void>
    {
        return Promise.resolve();
    }


    provideSettings(settings: apiClientSettings)
    {
        this.settings = settings;
    }

    /**
     * Override for signin redirection processing
     * @returns
     */
    signinRedirect(): Promise<void>
    {
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