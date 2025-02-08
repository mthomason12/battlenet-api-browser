import { apiClientSettings } from "../services/apiclientsettings";

/**
 * New forms of API connection (e.g. via a proxy, an SSH tunnel, or an encrypted IP stream) should
 * inherit from this.
 */
export abstract class APIConnection {

    settings?: apiClientSettings;

    provideSettings(settings: apiClientSettings)
    {
        this.settings = settings;
    }

    /**
     * Override for signin redirection processing
     * @returns
     */
    async signinRedirect(): Promise<void>
    {
        return new Promise<void>((resolve)=>{
            resolve();
        });
    }

    /**
     * Get OAuth access token
     */
    abstract getAccessToken(): Promise<string>;

    /**
     * Set OAuth access token (e.g. after authentication has provided a personal one)
     * @param token 
     */
    abstract setAccessToken(token: string): void;

    /**
     * Execute API call
     * @param apiEndpoint 
     * @param params 
     * @param options 
     */
    abstract apiCall<T = any>(apiEndpoint: string, params: string, options: object): Promise<T | undefined>

}