import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { dataStruct, apiSearchResponse, linksStruct, genderStruct, factionStruct, refStruct, realmStruct, keyStruct, hrefStruct, IApiDataDoc, IIndexItem, IApiIndexDoc, characterRef, idNameStruct, idkeyStruct } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";
import { guildCrestStruct } from "./profile-guild";

interface characterAchievementCriteria {
    id: number;
    is_completed: boolean;
    child_criteria?: characterAchievementCriteria[];
}

interface characterAchievementItem {
    id: number;
    achievement: refStruct;
    criteria: characterAchievementCriteria
    completed_timestamp: number;
}

export interface characterAchievementSummaryData {
    _links: linksStruct;
    total_quantity: number;
    total_points: number;
    achievements: characterAchievementItem[];
    character: characterRef;
    statistics: hrefStruct;
}

interface characterAchievementStatisticsCategory {
    id: number;
    name: string;
    sub_categories?: characterAchievementStatisticsCategory[];
}

interface characterAchievementStatisticItem {
    id: number;
    name: string;
    last_updated_timestamp: number;
    quantity: number;
}

export interface characterAchievementStatisticsData {
    _links: linksStruct;    
    character: characterRef;
    statistics: characterAchievementStatisticItem[];
    categories: characterAchievementStatisticsCategory[];

}

interface characterAppearanceItem {
    id: number;
    slot: {
        type: string;
        name: string;
    }
    enchant: number;
    item_appearance_modifier_id: number;
    internal_slot_id: number;
    subclass: number;
}

interface characterCustomizationItem {
    option: idNameStruct;
    choice: {
        id: number;
        name?: string;
        display_order: number;
    }
}

export interface characterAppearanceSummaryData {
    _links: linksStruct;
    character: characterRef;
    playable_race: refStruct;
    playable_class: refStruct;
    active_spec: refStruct;
    gender: genderStruct;
    faction: factionStruct;
    guild_crest: guildCrestStruct;
    items: characterAppearanceItem[];
    customizations: characterCustomizationItem[];
}

interface characterHeirloomItem {
    heirloom: refStruct;
    upgrade: {
        level: number;
    }
}

export interface characterHeirloomData {
    _links: linksStruct;
    heirlooms: characterHeirloomItem[];
}

interface characterMountItem {
    mount: refStruct;
    is_useable: boolean;
    is_favorite?: boolean;
}

export interface characterMountData {
    _links: linksStruct;
    mounts: characterMountItem[];
}

interface characterPetItem {
    species: refStruct;
    level: number;
    quality: {
        type: string;
        name: string;
    }
    stats: {
        breed_id: number;
        health: number;
        power: number;
        speed: number;
    }
    name: string;
    creature_display: idkeyStruct;
    is_favorite?: boolean;
    id: number;
}

export interface characterPetData {
    _links: linksStruct;
    pets: characterPetItem[];
}

interface characterToyItem {
    toy: refStruct;
    is_favorite?: boolean;
}

export interface characterToyData {
    _links: linksStruct;
    toys: characterToyItem[];
}

interface characterTransmogSlot {
    slot: {
        type: string;
        name: string;
    }
    appearances: refStruct;
}

export interface characterTransmogData {
    _links: linksStruct;
    appearance_sets: refStruct[];
    slots: characterTransmogSlot[];
}

interface characterDungeonEncounterItem {
    encounter: refStruct;
    completed_count: number;
    last_kill_timestamp: number;
}

interface characterDungeonModeItem {
    difficulty: {
        type: string;
        name: string;
    }
    status: {
        type: string;
        name: string;
    }    
    progress: {
        completed_count: number;
        total_count: number;
        encounters: characterDungeonEncounterItem[];
    }
}

interface characterDungeonInstanceItem {
    instance: refStruct;
    modes: characterDungeonModeItem[];
}

interface characterDungeonExpansionItem {
    expansion: refStruct;
    instances: characterDungeonInstanceItem[];
}

export interface characterDungeonData {
    _links: linksStruct;
    expansions: characterDungeonExpansionItem[];
}

export interface characterRaidData {
    _links: linksStruct;
    expansions: characterDungeonExpansionItem[];
}


export interface characterProfileData extends IApiDataDoc {
    _links: linksStruct;
    id: number;
    name: string;
    gender: genderStruct;
    faction: factionStruct;
    race: refStruct;
    character_class: refStruct;
    active_spec: refStruct;
    realm: realmStruct;
    guild: {
        key: keyStruct;
        name: string;
        id: number;
        realm: realmStruct;
        faction: factionStruct;
    };
    level: number;
    experience: number;
    achievement_points: number;
    achievements: hrefStruct;
    titles: hrefStruct;
    pvp_summary: hrefStruct;
    encounters: hrefStruct;
    media: hrefStruct;
    specializations: hrefStruct;
    statistics: hrefStruct;
    mythic_keystone_profile: hrefStruct;
    equipment: hrefStruct;
    appearance: hrefStruct;
    collections: hrefStruct;    
    reputations: hrefStruct;
    quests: hrefStruct;
    achievements_statistics: hrefStruct;
    professions: hrefStruct;
    last_login_timestamp: number;
    average_item_level: number;
    equipped_item_level: number;
    active_title: {
        key: keyStruct;
        name: string;
        id: number;
        display_string: string;
    }
    covenant_progress: {
        chosen_covenant: refStruct;
        renown_level: number;
        soulbinds: hrefStruct;
    }
    name_search: string;
    //additional data we've added to the API
    $id: string;
    $achievementData: characterAchievementSummaryData;
    $statisticsData: characterAchievementStatisticsData;
    $appearanceData: characterAppearanceSummaryData;
    //collections    
    $heirloomData: characterHeirloomData;
    $mountData: characterMountData;
    $petData: characterPetData;
    $toyData: characterToyData;
    $transmogData: characterTransmogData;
    //encounters
    $dungeonData: characterDungeonData;
    $raidData: characterRaidData;
}

export interface characterProfileIndexData extends IIndexItem, IApiIndexDoc{
    id: number,
    name: string;
    faction: string;
    race: string;
    character_class: string;
    level: number;
    active_spec: string;
    realm: string;
    guild: string;
    $id: string;    
}

/**
 * Use a dbDataNoIndex as there's no index, but we're going to override search because we can only look for individual characters
 * in the API.
 */
export class profileCharactersDataDoc extends dbDataNoIndex<characterProfileData, characterProfileData, characterProfileIndexData>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "group";
        this.type = "profile-characters";
        this.pathName = "characters";
        this.title = "Characters";
        this.stringKey = true;
        this.key = "$id"; //override key because we're making our own from 
        this.hideKey = true;
        //disable search as this requires a direct lookup
        this.isSearchable = false;
    }


    /**
     * We're going to use the getAPISearch method but fudge it so it interfaces via the usual searchParams, pulling out the realm
     * and character slugs. Finally we return the character in apiSearchResponse format.
     * @param api 
     * @param searchParams 
     * @param params 
     * @returns 
     */
    override getAPISearch(api: apiClientService, searchParams: APISearchParams, params: object): Promise<apiSearchResponse<characterProfileData> | undefined> {
        var realm: string = Slugify(searchParams.find('realm')?.values[0]!);
        var character: string= Slugify(searchParams.find('character')?.values[0]!);
        return new Promise((resolve, reject)=>{
            if (realm && character) {
            api.getCharacterProfileSummary(realm, character).then((result)=>{
                if (result) {
                    result.$id = Slugify(result.name)+'@'+result.realm.slug;
                }
                resolve(this.fakeSearchResponse(result));
            }); } else {
                resolve(this.fakeSearchResponse(undefined));
            }
        });
    }

    fakeSearchResponse(result: characterProfileData|undefined): apiSearchResponse<characterProfileData>
    {
        return {
            page: 1,
            pageSize: result ? 1 : 0,
            results: result ? [result] : []
        }
    }

    override getAPIExtra(apiClient: apiClientService, apiRec: characterProfileData): Promise<void> {
        return new Promise((resolve)=>{
            Promise.allSettled([
                apiClient.getCharacterAchievementsSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$achievementData = data;
                }),
                apiClient.getCharacterAchievementsStatistics(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$statisticsData = data;
                }),                
                apiClient.getCharacterAppearanceSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$appearanceData = data;
                }),
                apiClient.getCharacterHeirlooms(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$heirloomData = data;
                }),  
                apiClient.getCharacterMounts(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$mountData = data;
                }),  
                apiClient.getCharacterPets(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$petData = data;
                }),  
                apiClient.getCharacterToys(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$toyData = data;
                }),      
                apiClient.getCharacterTransmogs(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$transmogData = data;
                }),            
                apiClient.getCharacterDungeons(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$dungeonData = data;
                }),              
                apiClient.getCharacterRaids(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$raidData = data;
                }),                                                                                                              
            ]).then(()=>{
                resolve();
            })
        });
    }    

    /**
     * Retrieve character by "id" (realm/name)
     * @param api 
     * @param id 
     * @returns 
     */
    override getAPIRec(api: apiClientService, id: string): Promise<characterProfileData | undefined> {
        var realm: string;
        var character: string;
        [character,realm] = id.split('@');
        return api.getCharacterProfileSummary(realm, character);
    }

    override makeIndexItem(item: characterProfileData): characterProfileIndexData {
        return {
            $id: Slugify(item.name)+'@'+item.realm.slug,
            id: item.id,
            name: item.name,
            faction: item.faction.type,
            race: item.race.name,
            character_class: item.character_class.name,
            level: item.level,
            active_spec: item.active_spec.name,
            realm: item.realm.name,
            guild: item.guild.name,
            lastUpdate: Date.now()
        }
    }
    
}