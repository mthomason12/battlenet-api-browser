import { apiSearchResponse, mediaDataStruct } from '../model/datastructs';
import { EventEmitter, inject, Injectable } from '@angular/core';
import { ExtensionManagerService } from '../extensions/extension-manager.service';
import { apiClientSettings } from './apiclientsettings';
import { APIConnection } from '../lib/apiconnection';
import { BlizzardAPIConnection } from './blizzardapi-connection';
import { UserdataService } from './userdata.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { APISearchParams } from './apisearch';
import { guildRosterData } from '../model/profile-guild';
import { APIAchievement, APIAchievementCategoriesIndex, APIAchievementCategory, APIAchievementMedia, APIAchievementsIndex } from '../model/api/gamedata/achievements';
import { APIConnectedRealm, APIConnectedRealmsIndex } from '../model/api/gamedata/connected-realm';
import { APIItem, APIItemClass, APIItemClassesIndex, APIItemMedia, APIItemSearchItem, APIItemSet, APIItemSetsIndex, APIItemSubclass } from '../model/api/gamedata/item';
import { APICreature, APICreatureDisplayMedia, APICreatureFamiliesIndex, APICreatureFamily, APICreatureFamilyMedia, APICreatureType, APICreatureTypesIndex } from '../model/api/gamedata/creature';
import { APIAuctions, APICommodities } from '../model/api/gamedata/auction-house';
import { APIJournalEncounter, APIJournalEncounterSearchItem, APIJournalEncountersIndex, APIJournalExpansion, APIJournalExpansionsIndex, APIJournalInstance, APIJournalInstanceMedia, APIJournalInstancesIndex } from '../model/api/gamedata/journal';
import { APIMediaSearch } from '../model/api/gamedata/media-search';
import { APIMount, APIMountIndex, APIMountSearch } from '../model/api/gamedata/mount';
import { APIPet, APIPetAbilitiesIndex, APIPetAbility, APIPetAbilityMedia, APIPetIndex, APIPetMedia } from '../model/api/gamedata/pet';
import { APIRealm, APIRealmSearch, APIRealmsIndex } from '../model/api/gamedata/realm';
import { APIRegion, APIRegionsIndex } from '../model/api/gamedata/region';
import { APIQuest, APIQuestArea, APIQuestAreasIndex, APIQuestCategoriesIndex, APIQuestCategory, APIQuestType, APIQuestTypesIndex } from '../model/api/gamedata/quest';
import { APIReputationFaction, APIReputationFactionIndex, APIReputationTier, APIReputationTierIndex } from '../model/api/gamedata/reputation';
import { APICharacterProfileStatus, APICharacterProfileSummary } from '../model/api/profile/character-profile';
import { APICharacterAchievementsStatistics, APICharacterAchievementsSummary } from '../model/api/profile/character-achievements';
import { APICharacterAppearanceSummary } from '../model/api/profile/character-appearance';
import { APICharacterHeirloomsCollectionSummary, APICharacterMountsCollectionSummary, APICharacterPetsCollectionSummary, APICharacterToysCollectionSummary, APICharacterTransmogCollectionSummary } from '../model/api/profile/character-collections';
import { APICharacterDungeons, APICharacterEncountersSummary, APICharacterRaids } from '../model/api/profile/character-encounters';
import { APICharacterEquipmentSummary } from '../model/api/profile/character-equipment';
import { APICharacterHunterPetsSummary } from '../model/api/profile/character-hunter-pets';
import { APICharacterMediaSummary } from '../model/api/profile/character-media';
import { APICharacterMythicKeystoneProfileIndex, APICharacterMythicKeystoneSeasonDetails } from '../model/api/profile/character-mythic-keystone-profile';
import { APIAccountCollectionsIndex, APIAccountHeirloomsCollectionSummary, APIAccountMountsCollectionSummary, APIAccountPetsCollectionSummary, APIAccountProfileSummary, APIAccountToysCollectionSummary, APIAccountTransmogCollectionSummary, APIProtectedCharacterProfileSummary } from '../model/api/profile/account-profile';
import { APICharacterProfessionsSummary } from '../model/api/profile/character-profession';
import { APICharacterPvPBracketStatistics, APICharacterPvPSummary } from '../model/api/profile/character-pvp';
import { APICharacterCompletedQuests, APICharacterQuests } from '../model/api/profile/character-quests';
import { APICharacterReputationsSummary } from '../model/api/profile/character-reputations';
import { APICharacterSoulbinds } from '../model/api/profile/character-soulbinds';
import { APICharacterSpecializationsSummary } from '../model/api/profile/character-specializations';
import { APICharacterStatisticsSummary } from '../model/api/profile/character-statistics';
import { APICharacterTitles } from '../model/api/profile/character-titles';
import { APIGuild, APIGuildAchievements, APIGuildActivity } from '../model/api/profile/guild';

interface APIQuery {
  apiEndpoint: string;
  params: string;
}

@Injectable({ providedIn: 'root', })
export class apiClientService {

  extMgr: ExtensionManagerService = inject(ExtensionManagerService);
  apiConnection?: APIConnection;
  //list of available connection types
  connections: Map<string, APIConnection> = new Map();
  settings?: apiClientSettings;

  staticNamespace: string = "static-us";
  dynamicNamespace: string = "dynamic-us";
  profileNamespace: string = "profile-us";
  locale: string = "en_US";

  private data: UserdataService;
  private router: Router;

  public connectedEvent = new EventEmitter<void>();

  protected httpClient: HttpClient;

  //a simple weakmap cache to avoid repeat queries being sent
  queryCache: WeakMap<APIQuery, object> = new WeakMap();

  constructor() {
    this.data = inject(UserdataService);
    this.router = inject(Router);
    this.httpClient = inject(HttpClient);

    //add the default connection
    this.connections.set('_default', new BlizzardAPIConnection(this.data.data.settings.getConnectionSettings("_default"), this.httpClient));
    //load additional connections from Extension Manager Service
    this.extMgr.connections.forEach((value, key) => {
      this.connections.set(key, new value.conn(this.data.data.settings.getConnectionSettings(key), this.httpClient));
    })

    //subscribe to settings changed events
    this.data.settingsChangedEmitter.subscribe(() => {
      //act as if we were provided settings from scratch again
      this.provideSettings(this.data.data.settings.api);
    })
  }

  /**
   * Provide the service with settings.  Typically done by the application using the service.
   */
  provideSettings(settings: apiClientSettings, liveChange = false) {
    this.settings = settings;

    //resolve chosen apiConnection and set it as active
    if (this.connections.has(this.settings.connectionType!))
      this.apiConnection = this.connections.get(this.settings.connectionType!);
    //use default if necessary
    if (!this.apiConnection) {
      this.settings.connectionType = "_default";
      this.apiConnection = this.connections.get('_default');
    }

    //provide settings to the active connection
    this.apiConnection?.provideSettings(this.data.data.settings.getConnectionSettings(this.settings.connectionType!));

    //auto-connect if appropriate
    if (!this.apiConnection!.isLoggingIn() && this.data.data.settings.autoConnect && !liveChange && this.canConnect()) {
      this.connect();
    }
  }


  //region base functionality

  async connect() {
    this.apiConnection!.connect().then(() => {
      sessionStorage.removeItem('is_logging_in');
      if (this.apiConnection!.isConnected())
        this.connectedEvent.emit();
    });
  }


  async authenticate() {
    sessionStorage.setItem('page_before_login', this.router.url);
    sessionStorage.setItem('is_logging_in', "1");
    return this.signinRedirect();
  }

  async signinRedirect() {
    return this.apiConnection!.signinRedirect();
  }

  completeAuthentication(authcode: string, router: Router) {
    this.apiConnection!.completeAuthentication(authcode, router);
  }

  canConnect(): boolean {
    return this.apiConnection!.canConnect();
  }

  isConnected(): boolean {
    return this.apiConnection!.isConnected();
  }

  isLoggedIn(): boolean {
    return this.apiConnection!.isLoggedIn();
  }

  isLoggingIn(): boolean {
    return this.apiConnection!.isLoggingIn();
  }

  //endregion


  //region Base Queries

  query<T = any>(apiEndpoint: string, params: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      //check the cache first
      var cacheKey = { apiEndpoint: apiEndpoint, params: params };
      var cacheResult = this.queryCache.get(cacheKey);
      if (cacheResult) {
        resolve(cacheResult as T);
      }
      else {
        var extraparams: string = "";
        if (params != "") {
          extraparams = "&" + params;
        }
        this.apiConnection?.apiCall(apiEndpoint + extraparams, "", {}).then((value) => {
          this.queryCache.set(cacheKey, value);
          resolve(value as T);
        }, (reason) => {
          reject(undefined);
        }).catch(() => reject());
      }
    });
  }

  queryStatic<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined> {
    return this.query<T>(apiEndpoint + "?namespace=" + this.staticNamespace + '&locale=' + this.locale, params);
  }

  queryDynamic<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined> {
    return this.query<T>(apiEndpoint + "?namespace=" + this.dynamicNamespace + '&locale=' + this.locale, params);
  }

  /** 
   * Private profile query.  Needs to pass an oauth access token from the user's battle.net account
   */
  queryProfile<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined> {
    return this.query<T>(apiEndpoint + "?namespace=" + this.profileNamespace + '&locale=' + this.locale, params);
  }

  /** 
   * Public profile query 
   * 
   */
  queryPubProfile<T = any>(apiEndpoint: string, params: string = ""): Promise<T | undefined> {
    return this.query<T>(apiEndpoint + "?namespace=" + this.profileNamespace + '&locale=' + this.locale, params);
  }


  //endregion

  //#region Achievements API

  getAchievementIndex(): Promise<APIAchievementsIndex | undefined> {
    return this.queryStatic('/data/wow/achievement/index');
  }

  getAchievement(id: number): Promise<APIAchievement | undefined> {
    return this.queryStatic(`/data/wow/achievement/${id}`);
  }

  getAchievementMedia(id: number): Promise<APIAchievementMedia | undefined> {
    return this.queryStatic(`/data/wow/media/achievement/${id}`);
  }

  getAchievementCategoryIndex(): Promise<APIAchievementCategoriesIndex | undefined> {
    return this.queryStatic('/data/wow/achievement-category/index');
  }

  getAchievementCategory(id: number): Promise<APIAchievementCategory | undefined> {
    return this.queryStatic(`/data/wow/achievement-category/${id}`);
  }

  //#endregion

  //#region Auctions API

  getAuctions(connectedRealmID: number): Promise<APIAuctions | undefined> {
    return this.queryStatic(`/data/wow/connected-realm/auctions/${connectedRealmID}`);
  }

  getCommodities(): Promise<APICommodities | undefined> {
    return this.queryStatic(`/data/wow/auctions/commodities`);
  }

  //#endregion

  //#region Azerite Essence API

  getAzeriteEssenceIndex(): Promise<any | undefined> {
    return this.queryStatic('/data/wow/azerite-essence/index');
  }

  getAzeriteEssence(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/azerite-essence/${id}`);
  }

  getAzeriteEssenceMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/azerite-essence/${id}`);
  }

  //#endregion

  //#region Connected Realm API

  getConnectedRealmsIndex(): Promise<APIConnectedRealmsIndex | undefined> {
    return this.queryDynamic('/data/wow/connected-realm/index');
  }

  getConnectedRealm(id: number): Promise<APIConnectedRealm | undefined> {
    return this.queryDynamic(`/data/wow/connected-realm/${id}`);
  }

  //#endregion

  //#region Covenant API

  getCovenantIndex(): Promise<any | undefined> {
    return this.queryStatic('/data/wow/covenant/index');
  }

  getCovenant(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/covenant/${id}`);
  }

  getCovenantMedia(id: number): Promise<mediaDataStruct | undefined> {
    return this.queryStatic(`/data/wow/media/covenant/${id}`);
  }

  getSoulbindIndex(): Promise<any | undefined> {
    return this.queryStatic('/data/wow/covenant/soulbind/index');
  }

  getSoulbind(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/covenant/soulbind/${id}`);
  }

  getConduitIndex(): Promise<any | undefined> {
    return this.queryStatic('/data/wow/covenant/conduit/index');
  }

  getConduit(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/covenant/conduit/${id}`);
  }

  //#endregion

  //#region Creature API

  getCreature(id: number): Promise<APICreature | undefined> {
    return this.queryStatic(`/data/wow/creature/${id}`);
  }

  getCreatureDisplayMedia(displayId: number): Promise<APICreatureDisplayMedia | undefined> {
    return this.queryStatic(`/data/wow/media/creature-display/${displayId}`);
  }

  getCreatureFamilyIndex(): Promise<APICreatureFamiliesIndex | undefined> {
    return this.queryStatic(`/data/wow/creature-family/index`);
  }

  getCreatureFamily(id: number): Promise<APICreatureFamily | undefined> {
    return this.queryStatic(`/data/wow/creature-family/${id}`);
  }

  getCreatureFamilyMedia(id: number): Promise<APICreatureFamilyMedia | undefined> {
    return this.queryStatic(`/data/wow/media/creature-family/${id}`);
  }

  getCreatureTypesIndex(): Promise<APICreatureTypesIndex | undefined> {
    return this.queryStatic(`/data/wow/creature-type/index`);
  }

  getCreatureType(id: number): Promise<APICreatureType | undefined> {
    return this.queryStatic(`/data/wow/creature-type/${id}`);
  }

  //#endregion

  //#region Guild Crest API

  getGuildCrestComponentsIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/guild-crest/index`);
  }

  getGuildCrestBorderMedia(id: number): Promise<mediaDataStruct | undefined> {
    return this.queryStatic(`/data/wow/media/guild-crest/border/${id}`);
  }

  getGuildCrestEmblemMedia(id: number): Promise<mediaDataStruct | undefined> {
    return this.queryStatic(`/data/wow/media/guild-crest/emblem/${id}`);
  }

  //#endregion

  //#region Heirloom API

  getHeirloomIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/heirloom/index`);
  }

  getHeirloom(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/heirloom/${id}`);
  }

  //#endregion

  //#region Item API

  getItem(id: number): Promise<APIItem | undefined> {
    return this.queryStatic(`/data/wow/item/${id}`);
  }

  getItemSearch(params: APISearchParams): Promise<apiSearchResponse<APIItemSearchItem> | undefined> {
    return this.queryStatic(`/data/wow/search/item`, `name.en_US=${params.toQueryString()}`);
  }

  getItemMedia(id: number): Promise<APIItemMedia | undefined> {
    return this.queryStatic(`/data/wow/media/item/${id}`);
  }

  getItemClassesIndex(): Promise<APIItemClassesIndex | undefined> {
    return this.queryStatic(`/data/wow/item-class/index`);
  }

  getItemClass(id: number): Promise<APIItemClass | undefined> {
    return this.queryStatic(`/data/wow/item-class/${id}`);
  }

  getItemSetsIndex(): Promise<APIItemSetsIndex | undefined> {
    return this.queryStatic(`/data/wow/item-set/index`);
  }

  getItemSet(id: number): Promise<APIItemSet | undefined> {
    return this.queryStatic(`/data/wow/item-set/${id}`);
  }

  getItemSubclass(id: number, subid: number): Promise<APIItemSubclass | undefined> {
    return this.queryStatic(`/data/wow/item-class/${id}/item-subclass/${subid}`);
  }

  //#endregion  

  //region Item Appearance API

  getItemAppearance(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/item-appearance/${id}`);
  }

  getItemAppearanceSearch(params: string): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/search/item-appearance?${params}`);
  }

  getItemAppearanceSetIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/item-appearance/set/index`);
  }

  getItemAppearanceSet(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/item-appearance/set/${id}`);
  }

  getItemAppearanceSlotIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/item-appearance/slot/index`);
  }

  getItemAppearanceSlot(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/item-appearance/slot/${id}`);
  }

  //#endregion

  //region Journal API

  getJournalExpansionsIndex(): Promise<APIJournalExpansionsIndex | undefined> {
    return this.queryStatic(`/data/wow/journal-expansion/index`);
  }

  getJournalExpansion(id: number): Promise<APIJournalExpansion | undefined> {
    return this.queryStatic(`/data/wow/journal-expansion/${id}`);
  }

  getJournalEncountersIndex(): Promise<APIJournalEncountersIndex | undefined> {
    return this.queryStatic(`/data/wow/journal-encounter/index`);
  }

  getJournalEncounter(id: number): Promise<APIJournalEncounter | undefined> {
    return this.queryStatic(`/data/wow/journal-encounter/${id}`);
  }

  getJournalEncounterSearch(params: string): Promise<apiSearchResponse<APIJournalEncounterSearchItem> | undefined> {
    return this.queryStatic(`/data/wow/search/journal-encounter?params=${params}`);
  }

  getJournalInstancesIndex(): Promise<APIJournalInstancesIndex | undefined> {
    return this.queryStatic(`/data/wow/journal-instance/index`);
  }

  getJournalInstance(id: number): Promise<APIJournalInstance | undefined> {
    return this.queryStatic(`/data/wow/journal-instance/${id}`);
  }

  getJournalInstanceMedia(id: number): Promise<APIJournalInstanceMedia | undefined> {
    return this.queryStatic(`/data/wow/media/journal-instance/${id}`);
  }

  //endregion


  //region Media Search API

  getMediaSearch(params: string): Promise<APIMediaSearch | undefined> {
    return this.queryStatic(`/data/wow/search/media?params=${params}`);
  }

  //endregion


  //region Modified Crafting API

  getModifiedCraftingIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/modified-crafting/index`);
  }

  getModifiedCraftingCategoryIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/modified-crafting/category/index`);
  }

  getModifiedCraftingCategory(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/modified-crafting/category/${id}`);
  }

  getModifiedCraftingReagentSlotTypeIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/modified-crafting/reagent-slot-type/index`);
  }

  getModifiedCraftingReagentSlotType(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/modified-crafting/reagent-slot-type/${id}`);
  }

  //endregion


  //region Mount API

  getMountIndex(): Promise<APIMountIndex | undefined> {
    return this.queryStatic(`/data/wow/mount/index`);
  }

  getMount(id: number): Promise<APIMount | undefined> {
    return this.queryStatic(`/data/wow/mount/${id}`);
  }

  getMountSearch(params: string): Promise<APIMountSearch | undefined> {
    return this.queryStatic(`/data/wow/search/mount?params=${params}`);
  }

  //endregion

  //region Mythic Keystone Affix API

  getKeystoneAffixIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/keystone-affix/index`);
  }

  getKeystoneAffix(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/keystone-affix/${id}`);
  }

  getKeystoneAffixMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/keystone-affix/${id}`);
  }

  //end region

  //region Mythic Keystone Dungeon API

  getMythicKeystoneIndex(): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/index`);
  }

  getMythicKeystoneDungeonIndex(): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/dungeon/index`);
  }

  getMythicKeystoneDungeon(id: number): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/dungeon/${id}`);
  }

  getMythicKeystonePeriodIndex(): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/period/index`);
  }

  getMythicKeystonePeriod(id: number): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/period/${id}`);
  }

  getMythicKeystoneSeasonIndex(): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/season/index`);
  }

  getMythicKeystoneSeason(id: number): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/mythic-keystone/season/${id}`);
  }

  //endregion

  //region Mythic Keystone Leaderboard API

  getMythicKeystoneLeaderboardIndex(realmId: number): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/connected-realm/${realmId}/mythic-leaderboard/index`);
  }

  getMythicKeystoneLeaderboard(realmId: number, dungeonId: number, periodId: number): Promise<any | undefined> {
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
  getMythicRaidLeaderboard(raid: string, faction: string): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/leaderboard/hall-of-fame/${raid}/${faction}`);
  }

  //endregion

  //region Pet API

  getPetsIndex(): Promise<APIPetIndex | undefined> {
    return this.queryStatic(`/data/wow/pet/index`);
  }

  getPet(id: number): Promise<APIPet | undefined> {
    return this.queryStatic(`/data/wow/pet/${id}`);
  }

  getPetMedia(id: number): Promise<APIPetMedia | undefined> {
    return this.queryStatic(`/data/wow/media/pet/${id}`);
  }

  getPetAbilitiesIndex(): Promise<APIPetAbilitiesIndex | undefined> {
    return this.queryStatic(`/data/wow/pet-ability/index`);
  }

  getPetAbility(id: number): Promise<APIPetAbility | undefined> {
    return this.queryStatic(`/data/wow/pet-ability/${id}`);
  }

  getPetAbilityMedia(id: number): Promise<APIPetAbilityMedia | undefined> {
    return this.queryStatic(`/data/wow/media/pet-ability/${id}`);
  }

  //endregion

  //region Playable Class API

  getPlayableClassIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-class/index`);
  }

  getPlayableClass(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-class/${id}`);
  }

  getPlayableClassMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/playable-class/${id}`);
  }

  getPlayableClassPVPTalentSlots(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-class/${id}/pvp-talent-slots`);
  }

  //endregion

  //region Playable Race API

  getPlayableRaceIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-race/index`);
  }

  getPlayableRace(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-race/${id}`);
  }

  //endregion

  //region Playable Specialization API

  getPlayableSpecializationIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-specialization/index`);
  }

  getPlayableSpecialization(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/playable-specialization/${id}`);
  }

  getPlayableSpecializationMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/playable-specialization/${id}`);
  }

  //endregion

  //region Power Type API

  getPowerTypesIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/power-type/index`);
  }

  getPowerType(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/power-type/${id}`);
  }

  //endregion

  //region Profession API

  getProfessionIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/profession/index`);
  }

  getProfession(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/profession/${id}`);
  }

  getProfessionMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/profession/${id}`);
  }

  getProfessionSkillTier(id: number, skilltierID: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/profession/${id}/skill-tier/${skilltierID}`);
  }

  getRecipe(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/recipe/${id}`);
  }

  getRecipeMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/recipe/${id}`);
  }

  //endregion

  //region PvP Season API

  getPVPSeasonsIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-season/index`);
  }

  getPVPSeason(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-season/${id}`);
  }

  getPVPLeaderboardIndex(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-season/${id}/pvp-leaderboard/index`);
  }

  getPVPLeaderboard(id: number, bracket: string): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-season/${id}/pvp-leaderboard/${bracket}}`);
  }

  getPVPRewardIndex(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-season/${id}/pvp-reward/index`);
  }

  //endregion


  //region PvP Tier API  

  getPVPTierIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-tier/index`);
  }

  getPVPTier(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-tier/${id}`);
  }

  getPVPTierMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/pvp-tier/${id}`);
  }

  //endregion


  //region Quest API

  /**
   * An "index of indexes" - returns links to the quest category, quest area, and quest type indexes
   * @returns 
   */
  getQuestIndex(): Promise<any> {
    return this.queryStatic(`/data/wow/quest/index`);
  }

  getQuest(id: number): Promise<APIQuest | undefined> {
    return this.queryStatic(`/data/wow/quest/${id}`);
  }

  getQuestCategoryIndex(): Promise<APIQuestCategoriesIndex | undefined> {
    return this.queryStatic(`/data/wow/quest/category/index`);
  }

  getQuestCategory(id: number): Promise<APIQuestCategory | undefined> {
    return this.queryStatic(`/data/wow/quest/category/${id}`);
  }

  getQuestAreaIndex(): Promise<APIQuestAreasIndex | undefined> {
    return this.queryStatic(`/data/wow/quest/area/index`);
  }

  getQuestArea(id: number): Promise<APIQuestArea | undefined> {
    return this.queryStatic(`/data/wow/quest/area/${id}`);
  }

  getQuestTypeIndex(): Promise<APIQuestTypesIndex | undefined> {
    return this.queryStatic(`/data/wow/quest/type/index`);
  }

  getQuestType(id: number): Promise<APIQuestType | undefined> {
    return this.queryStatic(`/data/wow/quest/type/${id}`);
  }

  //end region

  //region Realm API

  getRealmIndex(): Promise<APIRealmsIndex | undefined> {
    return this.queryDynamic(`/data/wow/realm/index`);
  }

  getRealm(slug: string): Promise<APIRealm | undefined> {
    return this.queryDynamic(`/data/wow/realm/${slug}`);
  }

  getRealmSearch(params: string): Promise<APIRealmSearch | undefined> {
    return this.queryDynamic(`/data/wow/search/realm?params=${params}`);
  }

  //endregion

  //region Region API

  getRegionIndex(): Promise<APIRegionsIndex | undefined> {
    return this.queryDynamic(`/data/wow/region/index`);
  }

  getRegion(id: number): Promise<APIRegion | undefined> {
    return this.queryDynamic(`/data/wow/region/${id}`);
  }

  //endregion

  //region Reputation API

  getReputationFactionIndex(): Promise<APIReputationFactionIndex | undefined> {
    return this.queryStatic(`/data/wow/reputation-faction/index`);
  }

  getReputationFaction(id: number): Promise<APIReputationFaction | undefined> {
    return this.queryStatic(`/data/wow/reputation-faction/${id}`);
  }

  getReputationTiersIndex(): Promise<APIReputationTierIndex | undefined> {
    return this.queryStatic(`/data/wow/reputation-tiers/index`);
  }

  getReputationTier(id: number): Promise<APIReputationTier | undefined> {
    return this.queryStatic(`/data/wow/reputation-tiers/${id}`);
  }

  //endregion

  //region Spells API

  getSpell(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/spell/${id}`);
  }

  getSpellMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/spell/${id}`);
  }

  getSpellSearch(params: string): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/search/spell?${params}`);
  }

  //endregion

  //region Talent API

  getTalentTreeIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/talent-tree/index`);
  }

  getTalentTree(id: number, specid: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/talent-tree/${id}/playable-specialization/${specid}`);
  }

  getTalentTreeNodes(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/talent-tree/${id}`);
  }

  getTalentsIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/talent/index`);
  }

  getTalent(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/talent/${id}`);
  }

  getPVPTalentsIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-talent/index`);
  }

  getPVPTalent(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/pvp-talent/${id}`);
  }

  //endregion

  //region Tech Talent API

  getTechTalentTreeIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/tech-talent-tree/index`);
  }

  getTechTalentTree(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/tech-talent-tree/${id}`);
  }

  getTechTalentIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/tech-talent/index`);
  }

  getTechTalent(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/tech-talent/${id}`);
  }

  getTechTalentMedia(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/media/tech-talent/${id}`);
  }

  //endregion

  //region Title API

  getTitleIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/title/index`);
  }

  getTitle(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/title/${id}`);
  }

  //region Toy API

  getToyIndex(): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/toy/index`);
  }

  getToy(id: number): Promise<any | undefined> {
    return this.queryStatic(`/data/wow/toy/${id}`);
  }

  //end region


  //region WoW Token API

  getWoWTokenIndex(): Promise<any | undefined> {
    return this.queryDynamic(`/data/wow/token/index`);
  }

  //endregion


  //#region Account Profile API

  getAccountProfileSummary(): Promise<APIAccountProfileSummary | undefined> {
    return this.queryProfile(`/profile/user/wow`);
  }

  getProtectedCharacterProfileSummary(characterId: number, realmId: number): Promise<APIProtectedCharacterProfileSummary | undefined> {
    return this.queryProfile(`/profile/user/wow/protected-character/${realmId}-${characterId}`);
  }

  getAccountCollectionsIndex(): Promise<APIAccountCollectionsIndex | undefined> {
    return this.queryProfile(`/profile/user/wow/collections`);
  }

  getAccountHeirloomsCollectionsSummary(): Promise<APIAccountHeirloomsCollectionSummary | undefined> {
    return this.queryProfile(`/profile/user/wow/collections/heirlooms`);
  }

  getAccountMountsCollectionsSummary(): Promise<APIAccountMountsCollectionSummary | undefined> {
    return this.queryProfile(`/profile/user/wow/collections/mounts`);
  }

  getAccountPetsCollectionsSummary(): Promise<APIAccountPetsCollectionSummary | undefined> {
    return this.queryProfile(`/profile/user/wow/collections/pets`);
  }

  getAccountToysCollectionsSummary(): Promise<APIAccountToysCollectionSummary | undefined> {
    return this.queryProfile(`/profile/user/wow/collections/toys`);
  }

  getAccountTransmogCollectionsSummary(): Promise<APIAccountTransmogCollectionSummary | undefined> {
    return this.queryProfile(`/profile/user/wow/collections/transmogs`);
  }

  //#endregion

  //region Character Achievements API

  getCharacterAchievementsSummary(realmSlug: string, characterName: string): Promise<APICharacterAchievementsSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/achievements`);
  }

  getCharacterAchievementsStatistics(realmSlug: string, characterName: string): Promise<APICharacterAchievementsStatistics | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/achievements/statistics`);
  }

  //region Character Appearance API  

  getCharacterAppearanceSummary(realmSlug: string, characterName: string): Promise<APICharacterAppearanceSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/appearance`);
  }

  //region Character Collections API  

  getCharacterHeirlooms(realmSlug: string, characterName: string): Promise<APICharacterHeirloomsCollectionSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/heirlooms`);
  }

  getCharacterMounts(realmSlug: string, characterName: string): Promise<APICharacterMountsCollectionSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/mounts`);
  }

  getCharacterPets(realmSlug: string, characterName: string): Promise<APICharacterPetsCollectionSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/pets`);
  }

  getCharacterToys(realmSlug: string, characterName: string): Promise<APICharacterToysCollectionSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/toys`);
  }

  getCharacterTransmogs(realmSlug: string, characterName: string): Promise<APICharacterTransmogCollectionSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/collections/transmogs`);
  }

  //endregion

  //region Character Encounters API

  getCharacterEncountersSummary(realmSlug: string, characterName: string): Promise<APICharacterEncountersSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/encounters`);
  }

  getCharacterDungeons(realmSlug: string, characterName: string): Promise<APICharacterDungeons | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/encounters/dungeons`);
  }

  getCharacterRaids(realmSlug: string, characterName: string): Promise<APICharacterRaids | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/encounters/raids`);
  }

  //endregion

  //region Character Equipment API

  getCharacterEquipmentSummary(realmSlug: string, characterName: string): Promise<APICharacterEquipmentSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/equipment`);
  }

  //endregion

  //region Character Hunter Pets API

  getCharacterHunterPetsSummary(realmSlug: string, characterName: string): Promise<APICharacterHunterPetsSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/hunter-pets`);
  }

  //end region

  //region Character Media API

  getCharacterMediaSummary(realmSlug: string, characterName: string): Promise<APICharacterMediaSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/character-media`);
  }

  //endregion

  //region Character Mythic Keystone Profile API

  getCharacterMythicKeystoneProfileIndex(realmSlug: string, characterName: string): Promise<APICharacterMythicKeystoneProfileIndex | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile`);
  }

  getCharacterMythicKeystoneSeasonDetails(realmSlug: string, characterName: string, seasonid: number): Promise<APICharacterMythicKeystoneSeasonDetails | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/mythic-keystone-profile/season/${seasonid}`);
  }

  //endregion

  //region Character Professions API

  getCharacterProfessionSummary(realmSlug: string, characterName: string): Promise<APICharacterProfessionsSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/professions`);
  }

  //endregion

  //region Character Profile API

  getCharacterProfileSummary(realmSlug: string, characterName: string): Promise<APICharacterProfileSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}`);
  }

  getCharacterProfileStatus(realmSlug: string, characterName: string): Promise<APICharacterProfileStatus | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/status`);
  }

  //endregion

  //region Character PvP API

  getCharacterPvPBracketStatistics(realmSlug: string, characterName: string, bracket: string): Promise<APICharacterPvPBracketStatistics | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/pvp-bracket/${bracket}`);
  }

  getCharacterPvPSummary(realmSlug: string, characterName: string): Promise<APICharacterPvPSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/pvp-summary`);
  }

  //endregion

  //region Character Quests API

  getCharacterQuests(realmSlug: string, characterName: string): Promise<APICharacterQuests | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/quests`);
  }

  getCharacterCompletedQuests(realmSlug: string, characterName: string): Promise<APICharacterCompletedQuests | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/quests/completed`);
  }

  //endregion

  //region Character Reputation API

  getCharacterReputationsSummary(realmSlug: string, characterName: string): Promise<APICharacterReputationsSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/reputations`);
  }

  //endregion


  //region Character Soulbinds API

  getCharacterSoulbinds(realmSlug: string, characterName: string): Promise<APICharacterSoulbinds | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/soulbinds`);
  }


  //endregion


  //region Character Specializations API

  getCharacterSpecializationsSummary(realmSlug: string, characterName: string): Promise<APICharacterSpecializationsSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/specializations`);
  }

  //endregion


  //region Character Statistics API

  getCharacterStatisticsSummary(realmSlug: string, characterName: string): Promise<APICharacterStatisticsSummary | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/statistics`);
  }

  //endregion

  //region Character Titles API

  getCharacterTitlesSummary(realmSlug: string, characterName: string): Promise<APICharacterTitles | undefined> {
    return this.queryPubProfile(`/profile/wow/character/${realmSlug}/${characterName}/titles`);
  }

  //endregion

  //region Guilds

  getGuild(realmSlug: string, guildName: string): Promise<APIGuild | undefined> {
    return this.queryPubProfile(`/data/wow/guild/${realmSlug}/${guildName}`);
  }

  getGuildActivity(realmSlug: string, guildName: string): Promise<APIGuildActivity | undefined> {
    return this.queryPubProfile(`/data/wow/guild/${realmSlug}/${guildName}/activity`);
  }

  getGuildAchievements(realmSlug: string, guildName: string): Promise<APIGuildAchievements | undefined> {
    return this.queryPubProfile(`/data/wow/guild/${realmSlug}/${guildName}/achievements`);
  }

  getGuildRoster(realmSlug: string, guildName: string): Promise<APIGuildRoster | undefined> {
    return this.queryPubProfile(`/data/wow/guild/${realmSlug}/${guildName}/roster`);
  }


  //endregion


}
