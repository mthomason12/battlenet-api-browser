import { achievementData, achievementsIndex } from '../model/achievements';
import { creatureFamilyData, creatureFamilyIndex, creatureTypeData, creatureTypeIndex } from '../model/creature';
import { QuestAreaData, QuestAreaIndex, QuestCategoryData, QuestCategoryIndex, QuestData, QuestTypeData, QuestTypeIndex } from '../model/quest';
import { realmData, realmIndex } from '../model/realm';
import { mountData, mountsIndex } from '../model/mounts';
import { connectedRealmData, connectedRealmIndex } from '../model/connectedrealm';
import { mediaDataStruct } from '../model/datastructs';
import { UserInfo } from 'angular-oauth2-oidc';
import { journalExpansionData, journalExpansionsIndex } from '../model/journal';
import { accountHeirlooms } from '../model/account-heirlooms';
import { accountProfileIndex } from '../model/account-characters';
import { petAbilityData, petAbilityIndex, petData, petsIndex } from '../model/pets';
import { regionData, regionIndex } from '../model/region';
import { ReputationFactionData, ReputationFactionIndex, ReputationTierData, ReputationTierIndex } from '../model/reputation';
import { accountPets } from '../model/account-pets';
import { accountMounts } from '../model/account-mounts';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { ExtensionManagerService } from '../extensions/extension-manager.service';
import { apiClientSettings } from './apiclientsettings';
import { APIConnection } from '../lib/apiconnection';
import { BlizzardAPIConnection } from './blizzardapi-connection';
import { UserManager, UserManagerSettings } from "oidc-client-ts";
import { UserdataService } from './userdata.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({  providedIn: 'root',})
export class apiClientService  { 

  extMgr: ExtensionManagerService = inject(ExtensionManagerService);
  apiConnection?: APIConnection;
  //list of available connection types
  connections: Map<string,APIConnection> = new Map();
  settings?: apiClientSettings;


      clientID: string;
      clientSecret: string;
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

  constructor(){
    this.data = inject(UserdataService);
    this.router = inject(Router);
    this.httpClient = inject(HttpClient);
    this.clientID = this.data.data.key.clientID;
    this.clientSecret = this.data.data.key.clientSecret;

    this.userManager = new UserManager(this.getClientSettings());

    this._loggingIn = sessionStorage.getItem('is_logging_in') === '1' ? true : false;

    //add the default connection
    this.connections.set('_default',new BlizzardAPIConnection(this.data.data));
    //load additional connections from Extension Manager Service
    this.extMgr.connections.forEach((value, key)=>{
      this.connections.set(key, value);
    })
  }

  /**
   * Provide the service with settings.  Typically done by the application using the service.
   */
  provideSettings(settings: apiClientSettings) {
    this.settings = settings;

    //resolve chosen apiConnection and set it as active
    if (this.connections.has(this.settings.connectionType!)) 
      this.apiConnection = this.connections.get(this.settings.connectionType!);
    else
      this.apiConnection = this.connections.get('_default');

    //provide settings to the active connection
    this.apiConnection?.provideSettings(settings);

    //auto-connect if appropriate
    if (!this._loggingIn && this.data.data.settings.autoConnect) 
    {
        this.connect();
    }  
  }


//region base functionality

async connect()
{    
    //get an access token
    this.apiConnection!.getAccessToken().then((token)=>{
      this.accessToken = token;
      this._connected = true;  
      sessionStorage.removeItem('is_logging_in');
      this.connectedEvent.emit();       
    });
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
        this.apiConnection?.setAccessToken(this.userAccessToken);
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

//endregion

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

//region Base Queries

  query<T = any>(apiEndpoint: string, params: string): Promise<T | undefined>
  {
    return new Promise((resolve, reject)=>{
        var extraparams: string = "";
        if (params != "")
        {
            extraparams = "&"+params;
        }    
        this.apiConnection?.apiCall(apiEndpoint, params, {}).then((value)=>{
            resolve(value as T);
        },(reason)=>{
            reject(undefined);
        })
    });
  }

  queryStatic<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined>
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.staticNamespace+'&locale='+this.locale, params);
  }  

  queryDynamic<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined>
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.dynamicNamespace+'&locale='+this.locale, params);
  }  

  /** 
   * Private profile query.  Needs to pass an oauth access token from the user's battle.net account
   */
  queryProfile<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined>
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.profileNamespace+'&locale='+this.locale, params);
  }  

  /** 
   * Public profile query 
   * 
   */
  queryPubProfile<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined>
  {
    return this.query<T>(apiEndpoint+"?namespace="+this.profileNamespace+'&locale='+this.locale, params);
  }  


//endregion

//#region Achievements API

  getAchievementIndex(): Promise<achievementsIndex| undefined>
  {
    return this.queryStatic<achievementsIndex>('/data/wow/achievement/index');
  }

  getAchievement(id: number): Promise<achievementData| undefined>
  {
    return this.queryStatic<achievementData>(`/data/wow/achievement/${id}`);
  }

  getAchievementMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/achievement/${id}`);
  }

  getAchievementCategoryIndex(): Promise<any| undefined>
  {
    return this.queryStatic('/data/wow/achievement-category/index');
  }

  getAchievementCategory(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/achievement-category/${id}`);
  }  

  //#endregion

  //#region Auctions API

  getAuctions(connectedRealmID: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/connected-realm/auctions/${connectedRealmID}`);
  } 

  getCommodities(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/auctions/commodities`);
  }   

  //#endregion

  //#region Azerite Essence API

  getAzeriteEssenceIndex(): Promise<any| undefined>
  {
    return this.queryStatic('/data/wow/azerite-essence/index');
  }  

  getAzeriteEssence(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/azerite-essence/${id}`);
  }    

  getAzeriteEssenceMedia(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/media/azerite-essence/${id}`);
  }      

  //#endregion

  //#region Connected Realm API

  getConnectedRealmsIndex(): Promise<connectedRealmIndex| undefined>
  {
    return this.queryDynamic('/data/wow/connected-realm/index');
  }  

  getConnectedRealm(id: number): Promise<connectedRealmData| undefined>
  {
    return this.queryDynamic(`/data/wow/connected-realm/${id}`);
  }    

  //#endregion

  //#region Covenant API

  getCovenantIndex(): Promise<any| undefined>
  {
    return this.queryStatic('/data/wow/covenant/index');
  }  

  getCovenant(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/covenant/${id}`);
  }  

  getCovenantMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/covenant/${id}`);
  }  

  getSoulbindIndex(): Promise<any| undefined>
  {
    return this.queryStatic('/data/wow/covenant/soulbind/index');
  }

  getSoulbind(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/covenant/soulbind/${id}`);
  }  

  getConduitIndex(): Promise<any| undefined>
  {
    return this.queryStatic('/data/wow/covenant/conduit/index');
  }

  getConduit(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/covenant/conduit/${id}`);
  }  

  //#endregion

  //#region Creature API

  getCreature(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/creature/${id}`);
  }  

  getCreatureDisplayMedia(displayId: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/creature-display/${displayId}`);
  }    

  getCreatureFamilyIndex(): Promise<creatureFamilyIndex| undefined>
  {
    return this.queryStatic(`/data/wow/creature-family/index`);
  }    

  getCreatureFamily(id: number): Promise<creatureFamilyData| undefined>
  {
    return this.queryStatic(`/data/wow/creature-family/${id}`);
  }      

  getCreatureFamilyMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/creature-family/${id}`);
  }      

  getCreatureTypesIndex(): Promise<creatureTypeIndex| undefined>
  {
    return this.queryStatic(`/data/wow/creature-type/index`);
  }      

  getCreatureType(id: number): Promise<creatureTypeData| undefined>
  {
    return this.queryStatic(`/data/wow/creature-type/${id}`);
  }    

  //#endregion

  //#region Guild Crest API

  getGuildCrestComponentsIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/guild-crest/index`);
  }  

  getGuildCrestBorderMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/guild-crest/border/${id}`);
  }      

  getGuildCrestEmblemMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/guild-crest/emblem/${id}`);
  }        

  //#endregion

  //#region Heirloom API

  getHeirloomIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/heirloom/index`);
  }  

  getHeirloom(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/heirloom/${id}`);
  }      

  //#endregion

  //#region Item API

  getItem(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item/${id}`);
  }      

  getItemSearch(params: string): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item/search?${params}`);
  }        

  getItemMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/item/${id}`);
  }    

  getItemClassesIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-class/index`);
  }    

  getItemClass(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-class/${id}`);
  }       

  getItemSetsIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-set/index`);
  }    

  getItemSet(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-set/${id}`);
  }       
  
  getItemSubclass(id: number, subid: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-class/${id}/item-subclass/${subid}`);
  }     

  //#endregion  

  //region Item Appearance API

  getItemAppearance(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-appearance/${id}`);
  }

  getItemAppearanceSearch(params: string): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/search/item-appearance?${params}`);
  }

  getItemAppearanceSetIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-appearance/set/index`);
  }

  getItemAppearanceSet(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-appearance/set/${id}`);
  }

  getItemAppearanceSlotIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-appearance/slot/index`);
  }

  getItemAppearanceSlot(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/item-appearance/slot/${id}`);
  }

  //#endregion

  //region Journal API

  getJournalExpansionsIndex(): Promise<journalExpansionsIndex| undefined>
  {
    return this.queryStatic(`/data/wow/journal-expansion/index`);
  }

  getJournalExpansion(id: number): Promise<journalExpansionData| undefined>
  {
    return this.queryStatic(`/data/wow/journal-expansion/${id}`);
  }

  getJournalEncountersIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/journal-encounter/index`);
  }

  getJournalEncounter(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/journal-encounter/${id}`);
  }

  getJournalEncounterSearch(params: string): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/search/journal-encounter?params=${params}`);
  }

  getJournalInstancesIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/journal-instance/index`);
  }

  getJournalInstance(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/journal-instance/${id}`);
  }

  getJournalInstanceMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/journal-instance/${id}`);
  }

  //endregion


  //region Media Search API

  getMediaSearch(params: string): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/search/media?params=${params}`);
  } 

  //endregion


  //region Modified Crafting API

  getModifiedCraftingIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/modified-crafting/index`);
  }

  getModifiedCraftingCategoryIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/modified-crafting/category/index`);
  }

  getModifiedCraftingCategory(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/modified-crafting/category/${id}`);
  }

  getModifiedCraftingReagentSlotTypeIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/modified-crafting/reagent-slot-type/index`);
  }

  getModifiedCraftingReagentSlotType(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/modified-crafting/reagent-slot-type/${id}`);
  }

  //endregion


  //region Mount API

  getMountIndex(): Promise<mountsIndex| undefined>
  {
    return this.queryStatic(`/data/wow/mount/index`);
  }

  getMount(id: number): Promise<mountData| undefined>
  {
    return this.queryStatic(`/data/wow/mount/${id}`);
  }

  getMountSearch(params: string): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/search/mount?params=${params}`);
  }

  //endregion

  //region Mythic Keystone Affix API

  getKeystoneAffixIndex(): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/keystone-affix/index`);
  }

  getKeystoneAffix(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/keystone-affix/${id}`);
  }

  getKeystoneAffixMedia(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/media/keystone-affix/${id}`);
  }  

  //end region

  //region Mythic Keystone Dungeon API

  getMythicKeystoneIndex(): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/index`);
  }

  getMythicKeystoneDungeonIndex(): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/dungeon/index`);
  }  

  getMythicKeystoneDungeon(id: number): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/dungeon/${id}`);
  }

  getMythicKeystonePeriodIndex(): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/period/index`);
  }  

  getMythicKeystonePeriod(id: number): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/period/${id}`);
  }

  getMythicKeystoneSeasonIndex(): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/season/index`);
  }  

  getMythicKeystoneSeason(id: number): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/mythic-keystone/season/${id}`);
  }  

  //endregion

  //region Mythic Keystone Leaderboard API

  getMythicKeystoneLeaderboardIndex(realmId: number): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/connected-realm/${realmId}/mythic-leaderboard/index`);
  }  

  getMythicKeystoneLeaderboard(realmId: number, dungeonId: number, periodId: number): Promise<any| undefined>
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
  getMythicRaidLeaderboard(raid: string, faction: string): Promise<any| undefined>
  {
    return this.queryDynamic(`/data/wow/leaderboard/hall-of-fame/${raid}/${faction}`);
  }  

  //endregion
 
  //region Pet API

  getPetsIndex(): Promise<petsIndex| undefined>
  {
    return this.queryStatic(`/data/wow/pet/index`);
  }

  getPet(id: number): Promise<petData| undefined>
  {
    return this.queryStatic(`/data/wow/pet/${id}`);
  }

  getPetMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/pet/${id}`);
  }    

  getPetAbilitiesIndex(): Promise<petAbilityIndex| undefined>
  {
    return this.queryStatic(`/data/wow/pet-ability/index`);
  }

  getPetAbility(id: number): Promise<petAbilityData| undefined>
  {
    return this.queryStatic(`/data/wow/pet-ability/${id}`);
  }

  getPetAbilityMedia(id: number): Promise<mediaDataStruct| undefined>
  {
    return this.queryStatic(`/data/wow/media/pet-ability/${id}`);
  }      

//endregion

//region Playable Class API

  getPlayableClassIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-class/index`);
  }

  getPlayableClass(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-class/${id}`);
  }

  getPlayableClassMedia(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/media/playable-class/${id}`);
  }

  getPlayableClassPVPTalentSlots(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-class/${id}/pvp-talent-slots`);
  }  

//endregion

//region Playable Race API

  getPlayableRaceIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-race/index`);
  }

  getPlayableRace(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-race/${id}`);
  }

//endregion

//region Playable Specialization API

  getPlayableSpecializationIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-specialization/index`);
  }

  getPlayableSpecialization(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/playable-specialization/${id}`);
  }

  getPlayableSpecializationMedia(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/media/playable-specialization/${id}`);
  }  

//endregion

//region Power Type API

  getPowerTypesIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/power-type/index`);
  }

  getPowerType(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/power-type/${id}`);
  }

//endregion

//region Profession API

  getProfessionIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/profession/index`);
  }

  getProfession(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/profession/${id}`);
  }

  getProfessionMedia(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/media/profession/${id}`);
  }

  getProfessionSkillTier(id: number, skilltierID: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/profession/${id}/skill-tier/${skilltierID}`);
  }

  getRecipe(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/recipe/${id}`);
  }

  getRecipeMedia(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/media/recipe/${id}`);
  }  

//endregion

//region PvP Season API
 
  getPVPSeasonsIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-season/index`);
  }

  getPVPSeason(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-season/${id}`);
  }

  getPVPLeaderboardIndex(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-season/${id}/pvp-leaderboard/index`);
  }

  getPVPLeaderboard(id: number, bracket: string): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-season/${id}/pvp-leaderboard/${bracket}}`);
  }  

  getPVPRewardIndex(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-season/${id}/pvp-reward/index`);
  }  

//endregion


//region PvP Tier API  

  getPVPTierIndex(): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-tier/index`);
  }

  getPVPTier(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/pvp-tier/${id}`);
  }

  getPVPTierMedia(id: number): Promise<any | undefined>
  {
    return this.queryStatic(`/data/wow/media/pvp-tier/${id}`);
  }    

//endregion
  

//region Quest API

  /**
   * An "index of indexes" - returns links to the quest category, quest area, and quest type indexes
   * @returns 
   */
  getQuestIndex(): Promise<any> 
  {
    return this.queryStatic(`/data/wow/quest/index`);
  }

  getQuest(id: number): Promise<QuestData| undefined>
  {
    return this.queryStatic(`/data/wow/quest/${id}`);
  }

  getQuestCategoryIndex(): Promise<QuestCategoryIndex | undefined> 
  {
    return this.queryStatic(`/data/wow/quest/category/index`);
  }

  getQuestCategory(id: number): Promise<QuestCategoryData| undefined>
  {
    return this.queryStatic(`/data/wow/quest/category/${id}`);
  }

  getQuestAreaIndex(): Promise<QuestAreaIndex | undefined> 
  {
    return this.queryStatic(`/data/wow/quest/area/index`);
  }

  getQuestArea(id: number): Promise<QuestAreaData | undefined> 
  {
    return this.queryStatic(`/data/wow/quest/area/${id}`);
  }

  getQuestTypeIndex(): Promise<QuestTypeIndex | undefined> 
  {
    return this.queryStatic(`/data/wow/quest/type/index`);
  }

  getQuestType(id: number): Promise<QuestTypeData | undefined>
  {
    return this.queryStatic(`/data/wow/quest/type/${id}`);
  }

  //end region

  //region Realm API

  getRealmIndex(): Promise<realmIndex| undefined>
  {
    return this.queryDynamic(`/data/wow/realm/index`);
  }

  getRealm(slug: string): Promise<realmData| undefined>
  {
    return this.queryDynamic(`/data/wow/realm/${slug}`);
  }

  getRealmSearch(params: string): Promise<any>
  {
    return this.queryDynamic(`/data/wow/search/realm?params=${params}`);
  }

  //endregion
  
  //region Region API

  getRegionIndex(): Promise<regionIndex| undefined> 
  {
    return this.queryDynamic(`/data/wow/region/index`);
  }

  getRegion(id: number): Promise<regionData| undefined> 
  {
    return this.queryDynamic(`/data/wow/region/${id}`);
  }

  //endregion

  //region Reputation API

  getReputationFactionIndex(): Promise<ReputationFactionIndex | undefined> 
  {
    return this.queryStatic(`/data/wow/reputation-faction/index`);
  }

  getReputationFaction(id: number): Promise<ReputationFactionData | undefined> 
  {
    return this.queryStatic(`/data/wow/reputation-faction/${id}`);
  }

  getReputationTiersIndex(): Promise<ReputationTierIndex | undefined> 
  {
    return this.queryStatic(`/data/wow/reputation-tiers/index`);
  }

  getReputationTier(id: number): Promise<ReputationTierData | undefined> 
  {
    return this.queryStatic(`/data/wow/reputation-tiers/${id}`);
  }  

//endregion

//region Spells API

  getSpell(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/spell/${id}`);
  }  

  getSpellMedia(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/media/spell/${id}`);
  }      

  getSpellSearch(params: string): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/search/spell?${params}`);
  }          

//endregion

//region Talent API

  getTalentTreeIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/talent-tree/index`);
  }  

  getTalentTree(id: number, specid: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/talent-tree/${id}/playable-specialization/${specid}`);
  }  
  
  getTalentTreeNodes(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/talent-tree/${id}`);
  }

  getTalentsIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/talent/index`);
  }    

  getTalent(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/talent/${id}`);
  }

  getPVPTalentsIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/pvp-talent/index`);
  }    

  getPVPTalent(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/pvp-talent/${id}`);
  }

//endregion

//region Tech Talent API

  getTechTalentTreeIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/tech-talent-tree/index`);
  }    

  getTechTalentTree(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/tech-talent-tree/${id}`);
  }

  getTechTalentIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/tech-talent/index`);
  }  

  getTechTalent(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/tech-talent/${id}`);
  }  

  getTechTalentMedia(id: number): Promise<any| undefined>
  {
    return this.queryStatic(`/data/wow/media/tech-talent/${id}`);
  }      

//endregion

//region Title API

  getTitleIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/title/index`);
  }  

  getTitle(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/title/${id}`);
  }  

//region Toy API

  getToyIndex(): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/toy/index`);
  }  

  getToy(id: number): Promise<any | undefined> 
  {
    return this.queryStatic(`/data/wow/toy/${id}`);
  }  

//end region


//WoW Token API

  getWoWTokenIndex(): Promise<any | undefined> 
  {
    return this.queryDynamic(`/data/wow/token/index`);
  }

//endregion


//#region Account Profile API

  getAccountProfileSummary(): Promise<any>
  {
    return this.queryProfile(`/profile/user/wow`);
  }    

  getProtectedCharacterProfileSummary(characterId: number, realmId: number): Promise<accountProfileIndex | undefined>
  {
    return this.queryProfile(`/profile/user/wow/protected-character/${realmId}-${characterId}`);
  }

  getAccountCollectionsIndex(): Promise<any>
  {
    return this.queryProfile(`/profile/user/wow/collections`);
  }   

  getAccountHeirloomsCollectionsSummary(): Promise<accountHeirlooms| undefined> 
  {
    return this.queryProfile(`/profile/user/wow/collections/heirlooms`);
  }   

  getAccountMountsCollectionsSummary(): Promise<accountMounts | undefined> 
  {
    return this.queryProfile(`/profile/user/wow/collections/mounts`);
  }   

  getAccountPetsCollectionsSummary(): Promise<accountPets | undefined> 
  {
    return this.queryProfile(`/profile/user/wow/collections/pets`);
  }   

  getAccountToysCollectionsSummary(): Promise<any> 
  {
    return this.queryProfile(`/profile/user/wow/collections/toys`);
  }   

  getAccountTransmogCollectionsSummary(): Promise<any>
  {
    return this.queryProfile(`/profile/user/wow/collections/transmogs`);
  }   

//#endregion

//region Character Collections API

  getCharacterAchievementsSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/achievements`);
  }

  getCharacterAchievementsStatistics(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/achievements/statistics`);
  }

  getCharacterAppearance(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/appearance`);
  }

  getCharacterHeirlooms(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/heirlooms`);
  }

  getCharacterMounts(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/mounts`);
  }

  getCharacterPets(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/pets`);
  }

  getCharacterToys(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/toys`);
  }

  getCharacterTransmogs(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/transmogs`);
  }

  //endregion

  //region Character Encounters API

  getCharacterEncountersSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/encounters`);
  }

  getCharacterDungeons(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/encounters/dungeons`);
  }

  getCharacterRaids(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/encounters/raids`);
  }

  //endregion

  //region Character Equipment API

  getCharacterEquipmentSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/equipment`);
  }

  //endregion

  //region Character Hunter Pets API

  getCharacterHunterPetsSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/hunter-pets`);
  }

//end region

//region Character Media API

  getCharacterMediaSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/character-media`);
  }

//endregion

//region Character Mythic Keystone Profile API

  getCharacterMythicKeystoneProfileIndex(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile`);
  }

  getCharacterMythicKeystoneSeasonDetails(realmSlug: string, characterName: string, seasonid: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile/season/${seasonid}`);
  }

//endregion

//region Character Professions API

  getCharacterProfessionSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/professions`);
  }

//endregion

//region Character Profile API

  getCharacterProfileSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}`);
  }

  getCharacterProfileStatus(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/status`);
  }

//endregion

//region todo 

  //character pvp
  //character quests
  //character reputation
  //character soulbinds
  //character specializations

//endregion

//region Character Statistics API

  getCharacterStatisticsSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/statistics`);
  }

//endregion

//region Character Titles API

  getCharacterTitlesSummary(realmSlug: string, characterName: string): Promise<any>
  {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/titles`);
  }

//endregion

//region Guilds

  //guild api
  

//endregion


}
