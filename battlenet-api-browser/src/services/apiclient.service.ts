import { BlizzAPI, RegionIdOrName, QueryOptions } from 'blizzapi';
import { Router } from '@angular/router';
import { UserdataService } from './userdata.service';
import { EventEmitter, inject } from '@angular/core';
import { UserManager, UserManagerSettings } from 'oidc-client-ts';
import { achievementData, achievementsIndex } from '../model/achievements';
import { creatureFamilyData, creatureFamilyIndex, creatureTypeData, creatureTypeIndex } from '../model/creature';
import { QuestAreaData, QuestAreaIndex, QuestCategoryData, QuestCategoryIndex, QuestData, QuestTypeData, QuestTypeIndex } from '../model/quest';
import { realmData, realmIndex } from '../model/realm';
import { mountData, mountsIndex } from '../model/mounts';
import { connectedRealmData, connectedRealmIndex } from '../model/connectedrealm';
import { mediaDataStruct } from '../model/datastructs';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'angular-oauth2-oidc';
import { journalExpansionData, journalExpansionsIndex } from '../model/journal';
import { accountHeirlooms } from '../model/account-heirlooms';
import { accountProfileIndex } from '../model/account-characters';


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
  private httpClient: HttpClient;

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

  queryDynamic<T = any>(apiEndpoint: string, params: string = "", options: QueryOptions = {}): Promise<T> | undefined
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.dynamicNamespace+'&locale='+this.locale, params, options);
  }  

  queryProfile<T = any>(apiEndpoint: string, params: string = "", options: QueryOptions = {}): Promise<T> | undefined
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.profileNamespace+'&locale='+this.locale, params, options);
  }  

  //#region

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

  //region

  //#region Achievements API

  getAchievementIndex(): Promise<achievementsIndex> | undefined
  {
    return this.queryStatic<achievementsIndex>('/data/wow/achievement/index');
  }

  getAchievement(id: number): Promise<achievementData> | undefined
  {
    return this.queryStatic<achievementData>(`/data/wow/achievement/${id}`);
  }

  getAchievementMedia(id: number): Promise<mediaDataStruct> | undefined
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

  getConnectedRealmsIndex(): Promise<connectedRealmIndex> | undefined
  {
    return this.queryDynamic('/data/wow/connected-realm/index');
  }  

  getConnectedRealm(id: number): Promise<connectedRealmData> | undefined
  {
    return this.queryDynamic(`/data/wow/connected-realm/${id}`);
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

  getCreatureFamilyIndex(): Promise<creatureFamilyIndex> | undefined
  {
    return this.queryStatic(`/data/wow/creature-family/index`);
  }    

  getCreatureFamily(id: number): Promise<creatureFamilyData> | undefined
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

  getJournalExpansionsIndex(): Promise<journalExpansionsIndex> | undefined
  {
    return this.queryStatic(`/data/wow/journal-expansion/index`);
  }

  getJournalExpansion(id: number): Promise<journalExpansionData> | undefined
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


  //region Modified Crafting API

  getModifiedCraftingIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/modified-crafting/index`);
  }

  getModifiedCraftingCategoryIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/modified-crafting/category/index`);
  }

  getModifiedCraftingCategory(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/modified-crafting/category/${id}`);
  }

  getModifiedCraftingReagentSlotTypeIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/modified-crafting/reagent-slot-type/index`);
  }

  getModifiedCraftingReagentSlotType(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/modified-crafting/reagent-slot-type/${id}`);
  }

  //endregion


  //region Mount API

  getMountIndex(): Promise<mountsIndex> | undefined
  {
    return this.queryStatic(`/data/wow/mount/index`);
  }

  getMount(id: number): Promise<mountData> | undefined
  {
    return this.queryStatic(`/data/wow/mount/${id}`);
  }

  getMountSearch(params: string): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/search/mount?params=${params}`);
  }

  //endregion

  //region Mythic Keystone Affix API

  getKeystoneAffixIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/keystone-affix/index`);
  }

  getKeystoneAffix(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/keystone-affix/${id}`);
  }

  getKeystoneAffixMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/keystone-affix/${id}`);
  }  

  //end region

  //region Mythic Keystone Dungeon API

  getMythicKeystoneIndex(): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/index`);
  }

  getMythicKeystoneDungeonIndex(): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/dungeon/index`);
  }  

  getMythicKeystoneDungeon(id: number): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/dungeon/${id}`);
  }

  getMythicKeystonePeriodIndex(): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/period/index`);
  }  

  getMythicKeystonePeriod(id: number): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/period/${id}`);
  }

  getMythicKeystoneSeasonIndex(): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/season/index`);
  }  

  getMythicKeystoneSeason(id: number): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/season/${id}`);
  }  

  //endregion

  //region Mythic Keystone Leaderboard API

  getMythicKeystoneLeaderboardIndex(realmId: number): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/connected-realm/${realmId}/mythic-leaderboard/index`);
  }  

  getMythicKeystoneLeaderboard(realmId: number, dungeonId: number, periodId: number): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/connected-realm/${realmId}/mythic-leaderboard/${dungeonId}/period/${periodId}`);
  }    

  //endregion

  //region Mythic Raid Leaderboard API

  /**
   * 
   * @param raid 
   * @param faction - should be "alliance" or "horde"
   * @returns 
   */
  getMythicRaidLeaderboard(raid: string, faction: string): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/leaderboard/hall-of-fame/${raid}/${faction}`);
  }  

  //endregion

  //region todo  

  //Pet
  //Playable Class
  //Playable Race
  //Playable Specialization
  //Power Type
  //Profession
  //PvP Season
  //PvP Tier

  //end region
  
  //region Quest API

  /**
   * An "index of indexes" - returns links to the quest category, quest area, and quest type indexes
   * @returns 
   */
  getQuestIndex(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/quest/index`);
  }

  getQuest(id: number): Promise<QuestData> | undefined
  {
    return this.queryStatic(`/data/wow/quest/${id}`);
  }

  getQuestCategoryIndex(): Promise<QuestCategoryIndex> | undefined
  {
    return this.queryStatic(`/data/wow/quest/category/index`);
  }

  getQuestCategory(id: number): Promise<QuestCategoryData> | undefined
  {
    return this.queryStatic(`/data/wow/quest/category/${id}`);
  }

  getQuestAreaIndex(): Promise<QuestAreaIndex> | undefined
  {
    return this.queryStatic(`/data/wow/quest/area/index`);
  }

  getQuestArea(id: number): Promise<QuestAreaData> | undefined
  {
    return this.queryStatic(`/data/wow/quest/area/${id}`);
  }

  getQuestTypeIndex(): Promise<QuestTypeIndex> | undefined
  {
    return this.queryStatic(`/data/wow/quest/type/index`);
  }

  getQuestType(id: number): Promise<QuestTypeData> | undefined
  {
    return this.queryStatic(`/data/wow/quest/type/${id}`);
  }

  //end region

  //region Realm API

  getRealmIndex(): Promise<realmIndex> | undefined
  {
    return this.queryDynamic(`/data/wow/realm/index`);
  }

  getRealm(slug: string): Promise<realmData> | undefined
  {
    return this.queryDynamic(`/data/wow/realm/${slug}`);
  }

  getRealmSearch(params: string): Promise<any> | undefined
  {
    return this.queryDynamic(`/data/wow/search/realm?params=${params}`);
  }

  //endregion
  
  
  //region todo

  //Region
  //Reputation
  //Spell
  //Talent
  //Tech Talent
  //Title
  //Toy
  //WoW Token

  //end region


  //#region Account Profile API

  getAccountProfileSummary(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow`);
  }    

  getProtectedCharacterProfileSummary(characterId: number, realmId: number): Promise<accountProfileIndex> | undefined
  {
    return this.queryProfile(`/profile/user/wow/protected-character/${realmId}-${characterId}`);
  }

  getAccountCollectionsIndex(): Promise<any> | undefined
  {
    return this.queryProfile(`/profile/user/wow/collections`);
  }   

  getAccountHeirloomsCollectionsSummary(): Promise<accountHeirlooms> | undefined
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

  //region todo

  //character achievements
  //character appearance
  //character collections
  //character encounters
  //character equipment
  //character hunter pets
  //character media
  //character mythic keystone profile
  //character professions
  //character profile
  //character pvp
  //character quests
  //character reputation
  //character soulbinds
  //character specializations
  //character statistics
  //character titles

  //guild api
  

  //endregion


}
