import { BlizzAPI, RegionIdOrName, QueryOptions } from 'blizzapi';
import { AuthConfig } from 'angular-oauth2-oidc';

const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://oauth.battle.net',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'spa',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid wow.profile',

  showDebugInformation: true,
};

export class ApiclientService { 
  region?: RegionIdOrName;
  clientID?: string;
  clientSecret?: string;
  blizzapi?: BlizzAPI;
  accessToken: string = "";
  staticNamespace: string = "static-us";
  dynamicNamespace: string = "dynamic=us";
  profileNamespace: string = "profile-us";
  locale: string = "en_US";
  
  connected: boolean = false;

  constructor ()
  {
  }

  async connect(region: RegionIdOrName, clientID: string, clientSecret: string)
  {  
    this.region = region;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.blizzapi = new BlizzAPI({
      region: region,
      clientId: clientID,
      clientSecret: clientSecret
    });    
    //get an access token
    this.accessToken = await this.blizzapi?.getAccessToken();
    this.connected = true;
  }



  query(apiEndpoint: string, options: QueryOptions = {})
  {
    return this.blizzapi?.query(apiEndpoint, options);
  }

  queryStatic(apiEndpoint: string, options: QueryOptions = {})
  {
    return this.query(apiEndpoint+"?namespace="+this.staticNamespace+'&locale='+this.locale, options);
  }  

  isConnected(): boolean
  {
    return this.connected;
  }

  //#region Achievements API

  getAchievementIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/achievement/index');
  }

  getAchievement(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/achievement/${id}`);
  }

  getAchievementMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/achievement/${id}`);
  }

  getAchievementCategoryIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/achievement-category/index');
  }

  getAchievementCategory(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/achievement-category/${id}`);
  }  

  //#endregion

  //#region Auctions API

  getAuctions(connectedRealmID: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/connected-realm/auctions/${connectedRealmID}`);
  } 

  getCommodities(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/auctions/commodities`);
  }   

  //#endregion

  //#region Azerite Essence API

  getAzeriteEssenceIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/azerite-essence/index');
  }  

  getAzeriteEssence(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/azerite-essence/${id}`);
  }    

  getAzeriteEssenceMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/azerite-essence/${id}`);
  }      

  //#endregion

  //#region Connectrd Realm API

  getConnectedRealmsIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/connected-realm/index');
  }  

  getConnectedRealm(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/connected-realm/${id}`);
  }    

  //#endregion

  //#region Covenant API

  getCovenantIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/covenant/index');
  }  

  getCovenant(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/covenant/${id}`);
  }  

  getCovenantMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/covenant/${id}`);
  }  

  getSoulbindIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/covenant/soulbind/index');
  }

  getSoulbind(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/covenant/soulbind/${id}`);
  }  

  getConduitIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/covenant/conduit/index');
  }

  getConduit(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/covenant/conduit/${id}`);
  }  

  //#endregion

  //#region Creature API

  getCreature(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/creature/${id}`);
  }  

  //#endregion




}
