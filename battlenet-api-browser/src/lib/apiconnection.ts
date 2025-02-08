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
     * Attempt to establish connection.  Return true if connection successfully 
     * established, false if not.
     */
    abstract connect(): Promise<boolean>;

    /**
     * Attempt battle.net authentication.  Return true if successful, false if not.
     */
    abstract authenticate(): Promise<boolean>;

    /**
     * Execute API call
     * @param apiEndpoint 
     * @param params 
     * @param options 
     */
    abstract apiCall<T = any>(apiEndpoint: string, params: string, options: object): Promise<T | undefined>

}