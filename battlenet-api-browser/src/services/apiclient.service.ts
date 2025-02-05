import { QueryOptions } from 'blizzapi';
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
import { apiClient } from './apiclient';
import { regionData, regionIndex } from '../model/region';


/**
 * This is missing a *lot* of error handling.
 * For example, it currently assumes every http call will return a successful result
 */
export class apiClientService extends apiClient { 

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

  //region todo  

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

  //region todo

  //Reputation
  //Spell
  //Talent
  //Tech Talent
  //Title
  //Toy
  //WoW Token

  //end region


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

  getAccountMountsCollectionsSummary(): Promise<any> 
  {
    return this.queryProfile(`/profile/user/wow/collections/mounts`);
  }   

  getAccountPetsCollectionsSummary(): Promise<any> 
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

  //region Characters

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

  //endregion

  //region Guilds

  //guild api
  

  //endregion


}
