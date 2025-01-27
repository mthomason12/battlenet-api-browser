import { BlizzAPI, RegionIdOrName, QueryOptions } from 'blizzapi';
import { Router } from '@angular/router';
import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { achievementData, achievementsIndex } from '../model/achievements';
import { creatureTypeData, creatureTypeIndex } from '../model/creature';
import { UserdataService } from './userdata.service';
import { inject } from '@angular/core';


/**
 * This is missing a *lot* of error handling.
 * For example, it currently assumes every http call will return a successful result
 */
export class ApiclientService { 
  region: RegionIdOrName;
  clientID: string;
  clientSecret: string;
  blizzapi: BlizzAPI;
  accessToken: string = "";
  userAccessTokenExpires: number = 0;
  userAccessToken: string = "";
  staticNamespace: string = "static-us";
  dynamicNamespace: string = "dynamic=us";
  profileNamespace: string = "profile-us";
  locale: string = "en_US";

  private _loggedIn = false;
  
  private _connected: boolean = false;

  public userManager: UserManager;
  private data: UserdataService;
  //private httpClient: HttpClient;

  constructor ()
  {   
    this.data = inject(UserdataService);
    //this.httpClient = inject(HttpClient);
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
    });
  }

  async authenticate(router: Router)
  {   
    sessionStorage.setItem('page_before_login', router.url);
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
          this._loggedIn = true;
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

  //#region Base queries

  query<T = any>(apiEndpoint: string, params: string, options: QueryOptions = {}): Promise<T> | undefined
  {
    var extraparams: string = "";
    if (params != "")
    {
      extraparams = "&"+params;
    }    
    return this.blizzapi.query(apiEndpoint, options) as Promise<T> | undefined;
  }

  queryStatic<T = any>(apiEndpoint: string, params: string = "", options: QueryOptions = {}): Promise<T> | undefined
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.staticNamespace+'&locale='+this.locale, params, options);
  }  

  queryProfile<T = any>(apiEndpoint: string, params: string = "", options: QueryOptions = {}): Promise<T> | undefined
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.profileNamespace+'&locale='+this.locale, params, options);
  }  

  //#region

  //#region Achievements API

  getAchievementIndex(): Promise<achievementsIndex> | undefined
  {
    return this.queryStatic<achievementsIndex>('/data/wow/achievement/index');
  }

  getAchievement(id: number): Promise<achievementData> | undefined
  {
    return this.queryStatic<achievementData>(`/data/wow/achievement/${id}`);
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

  getCreatureTypesIndex(): Promise<creatureTypeIndex> | undefined
  {
    return this.queryStatic(`/data/wow/creature-type/index`);
  }      

  getCreatureType(id: number): Promise<creatureTypeData> | undefined
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

  //#region Item API

  getItem(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item/${id}`);
  }      

  getItemSearch(params: string): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item/search?${params}`);
  }        

  getItemMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/item/${id}`);
  }    

  getItemClassesIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-class/index`);
  }    

  getItemClass(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-class/${id}`);
  }       

  getItemSetsIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-set/index`);
  }    

  getItemSet(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-set/${id}`);
  }       
  
  getItemSubclass(id: number, subid: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-class/${id}/item-subclass/${subid}`);
  }     

  //#endregion  

  //region Item Appearance API

  getItemAppearance(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-appearance/${id}`);
  }

  getItemAppearanceSearch(params: string): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/search/item-appearance?${params}`);
  }

  getItemAppearanceSetIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-appearance/set/index`);
  }

  getItemAppearanceSet(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-appearance/set/${id}`);
  }

  getItemAppearanceSlotIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-appearance/slot/index`);
  }

  getItemAppearanceSlot(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/item-appearance/slot/${id}`);
  }

  //#endregion

  //region Journal API

  getJournalExpansionsIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/journal-expansion/index`);
  }

  getJournalExpansion(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/journal-expansion/${id}`);
  }

  getJournalEncountersIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/journal-encounter/index`);
  }

  getJournalEncounter(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/journal-encounter/${id}`);
  }

  getJournalEncounterSearch(params: string): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/search/journal-encounter?params=${params}`);
  }

  getJournalInstancesIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/journal-instance/index`);
  }

  getJournalInstance(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/journal-instance/${id}`);
  }

  getJournalInstanceMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/journal-instance/${id}`);
  }

  //endregion


  //region Media Search API

  getMediaSearch(params: string): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/search/media?params=${params}`);
  } 

  //endregion


  //#region Account Profile API

  getAccountProfileSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow`);
  }    

  getProtectedCharacterProfileSummary(characterId: number, realmId: number): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/protected-character/${realmId}-${characterId}`);
  }

  getAccountCollectionsIndex(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections`);
  }   

  getAccountHeirloomsCollectionsSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections/heirlooms`);
  }   

  getAccountMountsCollectionsSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections/mounts`);
  }   

  getAccountPetsCollectionsSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections/pets`);
  }   

  getAccountToysCollectionsSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections/toys`);
  }   

  getAccountTransmogCollectionsSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections/transmogs`);
  }   

  //#endregion
}
