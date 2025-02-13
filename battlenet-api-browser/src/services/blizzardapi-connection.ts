import { BlizzAPI, RegionIdOrName, ResponseError } from "blizzapi";
import { APIConnection } from "../lib/apiconnection";
import { extensionDataStruct, userDataStruct } from "../model/userdata";
import { Router } from "@angular/router";
import { UserManager, UserManagerSettings } from "oidc-client-ts";
import { UserInfo } from "angular-oauth2-oidc";
import { HttpClient } from "@angular/common/http";
import { apiClientSettings } from "./apiclientsettings";

/**
 * Handles Client ID/Secret, OAuth, and HTTP calls to Battle.net API
 */
export class BlizzardAPIConnection extends APIConnection {

    blizzapi: BlizzAPI;
    region: RegionIdOrName;

    clientID: string;
    clientSecret: string;

    userAccessTokenExpires: number = 0;
    userAccessToken: string = "";

    accessToken: string = "";

    public userManager: UserManager;   

    constructor(settings: extensionDataStruct, httpClient: HttpClient) {
        super(settings, httpClient,"Direct API Connection");
        this.region = "us";
        this._loggingIn = sessionStorage.getItem('is_logging_in') === '1' ? true : false;

        this.clientID = this.settings['clientID'] ?? "";
        this.clientSecret = this.settings['clientSecret'] ?? "";

        this.blizzapi = new BlizzAPI({
            region: this.region!,
            clientId: this.clientID,
            clientSecret: this.clientSecret
        });  
        this.userManager = new UserManager(this.getClientSettings()); 
    
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

    override canConnect(): boolean {
        return (this.settings['clientID'] !=="" && this.settings['clientSecret'] !== "")
    }

    override connect(): Promise<void> {
        return new Promise((resolve,reject)=>{
            if (!this.canConnect())
                reject();
            this.getAccessToken().then ((token)=>{
                this.accessToken = token;
                this._connected = true;
                resolve();
            });
        });
    }

    override provideSettings(extSettings: extensionDataStruct)
    {
        super.provideSettings(extSettings);

        //reinitialize everything affected by a settings changed
        this.clientID = this.settings['clientID'] ?? "";
        this.clientSecret = this.settings['clientSecret'] ?? "";

        this.blizzapi = new BlizzAPI({
            region: this.region!,
            clientId: this.clientID,
            clientSecret: this.clientSecret
        });  
        
        this.userManager = new UserManager(this.getClientSettings()); 
    }


    override signinRedirect(): Promise<void> {
        return this.userManager.signinRedirect();
    }

    override completeAuthentication(authcode: string, router: Router)
    {
        const storedURL = sessionStorage.getItem('page_before_login') as string;
        sessionStorage.removeItem('page_before_login');  
        this.userManager.signinCallback().finally(() => { 
          this.userManager.getUser().then( (user)=>{
              this.userAccessToken = user!.access_token;
              this.setAccessToken(this.userAccessToken);
              this._loggedIn = true;
              this._loggingIn = false;
              this._connected = true;
              sessionStorage.removeItem('is_logging_in');
              router.navigate([storedURL]);
          });
        });
    }

    getAccessToken(): Promise<string> {
        return this.blizzapi.getAccessToken();
    }

    setAccessToken(token: string) {
        //replace blizzapi with one using our new access token
        this.blizzapi = new BlizzAPI({
            region: this.region!,
            clientId: this.clientID,
            clientSecret: this.clientSecret,
            accessToken: token
        });  
    }

    override apiCall<T = any>(apiEndpoint: string, params: string, options: object): Promise<T | undefined> {
        return new Promise<T | undefined>((resolve, reject)=>{
            (this.blizzapi.query(apiEndpoint, {}) as Promise <T | undefined>).then ((result)=>{
                resolve(result)
            }).catch (() => resolve(undefined)); //return "undefined" if we encountered any problems.
        })
        
    }

//region OAuth Queries

  /**
   * Currently returns the following structure
   * {
   *   sub: string, the user's numeric ID as a string
   *   id: number, the user's numeric ID
   *   battletag: string - the user's battletag
   * }
   * @returns 
   */
  userInfo(): Promise<UserInfo>
  {
    return new Promise((resolve, reject)=>
    {
      this.httpClient.request('GET','https://oauth.battle.net/oauth/userinfo',{responseType:'json', headers: this.bearerAuth() }).subscribe(
        (data)=>{
          resolve(data as UserInfo);
        }
      );
    });
  }

  /**
   * Returns a header for bearer authentication
   */
  bearerAuth(): {[Header: string]: string}
  {
    return {'Authorization': 'Bearer '+this.userAccessToken};
  }

//endregion

}