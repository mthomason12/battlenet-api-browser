import { BlizzAPI, RegionIdOrName } from "blizzapi";
import { UserManager, UserManagerSettings } from "oidc-client-ts";
import { UserdataService } from "./userdata.service";
import { Router } from "@angular/router";
import { EventEmitter, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export class apiClient {
    region: RegionIdOrName;
    clientID: string;
    clientSecret: string;
    blizzapi: BlizzAPI;
    accessToken: string = "";
    userAccessTokenExpires: number = 0;
    userAccessToken: string = "";
    staticNamespace: string = "static-us";
    dynamicNamespace: string = "dynamic-us";
    profileNamespace: string = "profile-us";
    locale: string = "en_US";
  
    private _loggedIn = false;
    private _loggingIn = false;
    
    private _connected: boolean = false;
  
    public userManager: UserManager;
    private data: UserdataService;
    private router: Router;
  
    public connectedEvent = new EventEmitter<void>();
    protected httpClient: HttpClient;

    constructor ()
    {   
    this.data = inject(UserdataService);
    this.router = inject(Router);
    this.httpClient = inject(HttpClient);
    this.clientID = this.data.data.key.clientID;
    this.clientSecret = this.data.data.key.clientSecret;
    this.region = "us";
    this.blizzapi = new BlizzAPI({
        region: this.region!,
        clientId: this.data.data.key.clientID,
        clientSecret: this.data.data.key.clientSecret
    });  
    //Log.setLogger(console);
    //Log.setLevel(Log.DEBUG);
    this.userManager = new UserManager(this.getClientSettings());

    this._loggingIn = sessionStorage.getItem('is_logging_in') === '1' ? true : false;

    //auto-connect if appropriate
    if (!this._loggingIn && this.data.data.settings.autoConnect) 
    {
        this.connect();
    }    
    } 

    getClientSettings(): UserManagerSettings
    {
        return {
        authority: 'https://oauth.battle.net',
        client_id: this.clientID,
        client_secret: this.clientSecret,
        redirect_uri: window.location.origin+'/auth-callback',
        post_logout_redirect_uri: window.location.origin+'/',
        silent_redirect_uri: window.location.origin+'/silent-callback.html',
        response_type:"code",
        scope:"openid wow.profile",
        client_authentication: 'client_secret_basic',
        //filterProtocolClaims: true,
        //loadUserInfo: true,
        //automaticSilentRenew: true,
        //popup_redirect_uri: window.location.origin+'/auth-callback',      
        };    
    }

    async connect()
    {    
        //get an access token
        this.blizzapi.getAccessToken().then((token)=>{
        this.accessToken = token;
        this._connected = true;  
        sessionStorage.removeItem('is_logging_in');
        this.connectedEvent.emit();       
        });
    }

    async authenticate()
    {   
        sessionStorage.setItem('page_before_login', this.router.url);
        sessionStorage.setItem('is_logging_in', "1");
        return this.signinRedirect();
    }

    async signinRedirect()
    {
        return this.userManager.signinRedirect();
    }

    async completeAuthentication(authcode: string, router: Router)
    {
        const storedURL = sessionStorage.getItem('page_before_login') as string;
        sessionStorage.removeItem('page_before_login');  
        this.userManager.signinCallback().finally(() => { 
        this.userManager.getUser().then(
            (user)=>{
            this.userAccessToken = user!.access_token;
            //replace blizzapi with one using our new access token
            this.blizzapi = new BlizzAPI({
                region: this.region!,
                clientId: this.data.data.key.clientID,
                clientSecret: this.data.data.key.clientSecret,
                accessToken: this.userAccessToken
            });  
            //this.userInfo();
            this._loggedIn = true;
            this._loggingIn = false;
            sessionStorage.removeItem('is_logging_in');
            this._connected = true;
            router.navigate([storedURL]);
            });
        });
    }

    
    isConnected(): boolean
    {
        return this._connected;
    }

    isLoggedIn(): boolean
    {
        return this._loggedIn;
    }

    isLoggingIn(): boolean
    {
        return this._loggingIn;
    }
}