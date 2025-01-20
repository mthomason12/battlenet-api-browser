import { BlizzAPI, RegionIdOrName, QueryOptions } from 'blizzapi';
import { Router } from '@angular/router';
import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';


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

  private userManager?: UserManager;

  constructor ()
  {

  }

  getClientSettings(): UserManagerSettings
  {
    return {
      authority: 'https://oauth.battle.net',
      client_id: this.clientID!,
      popup_redirect_uri: window.location.origin+'/auth-callback',
      redirect_uri: window.location.origin+'/auth-callback',
      post_logout_redirect_uri: window.location.origin+'/',
      response_type:"code",
      scope:"openid wow.profile",
      filterProtocolClaims: true,
      loadUserInfo: true,
      automaticSilentRenew: true,
      silent_redirect_uri: window.location.origin+'/silent-refresh.html'
    };    
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
    this.userManager = new UserManager(this.getClientSettings());    
  }

  async authenticate(clientID: string, clientSecret: string, router: Router)
  {
    sessionStorage.setItem('page_before_login', router.url);
    return this.signinRedirect();
  }

  async signinRedirect()
  {
    return this.userManager?.signinRedirect();
  }

  completeAuthentication(router: Router)
  {
    const storedURL = sessionStorage.getItem('page_before_login') as string;
    sessionStorage.removeItem('page_before_login');
    router.navigateByUrl(storedURL);
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

  //#region Connected Realm API

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

  getCreatureDisplayMedia(displayId: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/creature-display/${displayId}`);
  }    

  getCreatureFamilyIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/creature-family/index`);
  }    

  getCreatureFamily(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/creature-family/${id}`);
  }      

  getCreatureFamilyMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/creature-family/${id}`);
  }      

  getCreatureTypesIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/creature-type/index`);
  }      

  getCreatureType(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/creature-type/${id}`);
  }    

  //#endregion

  //#region Guild Crest API

  getGuildCrestComponentsIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/guild-crest/index`);
  }  

  getGuildCrestBorderMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/guild-crest/border/${id}`);
  }      

  getGuildCrestEmblemMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/guild-crest/emblem/${id}`);
  }        

  //#endregion

  //#region Heirloom API

  getHeirloomIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/heirloom/index`);
  }  

  getHeirloom(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/heirloom/${id}`);
  }      

  //#endregion
}
