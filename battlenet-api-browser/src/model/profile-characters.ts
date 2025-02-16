import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { dataStruct, apiSearchResponse, linksStruct, genderStruct, factionStruct, refStruct, realmStruct, keyStruct, hrefStruct, IApiDataDoc, IIndexItem, IApiIndexDoc, characterRef, idNameStruct, idkeyStruct, mediaStruct, rgbaColorStruct } from "./datastructs";
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

interface characterEquippedItemSocket {
    socket_type: {
        name: string;
        type: string;
    }
    item: refStruct;
    display_string: string;
    media: mediaStruct;
}

interface characterEquippedItemStat {
    type: {
        name: string;
        type: string;
    }
    value: number;
    display: {
        display_string: string;
        color: rgbaColorStruct;
    }
}

interface characterEquippedItem {
    item: refStruct;
    sockets: characterEquippedItemSocket[];
    slot: {
        name: string;
        type: string;
    }
    quantity: number;
    context: number;
    bonus_list: number[];
    quality: {
        name: string;
        type: string;
    }
    name: string;
    modified_appearance_id: number;
    media: mediaStruct;
    item_class: refStruct;
    item_subclass: refStruct;
    inventory_type: {
        name: string;
        type: string;
    }
    binding: {
        name: string;
        type: string;
    }
    armor: {
        value: number;
        display: {
            display_string: string;
            color: rgbaColorStruct;
        }
    }
    stats: characterEquippedItemStat[];
    sell_price?: {
        value: number;
        display_strings: {
            header: string;
            gold: string; //yes, these ARE strings here
            silver: string;
            copper: string;
        }
    }
    requirements?: {
        level?: {
            value: number,
            display_string: string
        }
        playable_classes?: {
            links: hrefStruct;
            display_string: string;
        }
    }
    set?: {
        item_set: refStruct;
        items: {
            item: refStruct;
            is_equipped?: boolean;
        }[];
        effects: {
            display_string: string;
            required_count: number;
            is_active: boolean;
        }[];
    }
    level: {
        value: number;
        display_string: string;
    }
    transmog: {
        item: refStruct;
        display_string: string;
        item_modified_appearance_id: number;
    }
    durability: {
        value: number;
        display_string: string;
    }    
}

export interface characterEquipmentData {
    _links: linksStruct;
    character:characterRef;
    equipped_items: characterEquippedItem[];
}

interface characterHunterPetItem {
    id: number;
    name: string;
    level: number;
    creature: refStruct;
    slot: number;
    creature_display: idkeyStruct;

}

export interface characterHunterPetsData {
    _links: linksStruct;
    character:characterRef;
    hunter_pets: characterHunterPetItem[];
}

export interface characterMediaData {
    _links: linksStruct;
    character:characterRef;
    assets: {
        key: string;
        value: string;
    }[];
}

export interface characterMythicKeystoneSummaryData {
    links: linksStruct;
    current_period: {
        period: idkeyStruct;
    }
    seasons: idkeyStruct[];
    character: characterRef;
    current_mythic_rating: {
        color: rgbaColorStruct;
        rating: number;
    }
}

interface characterMythicKeystoneRunMember {
    character: characterRef;
    specialization: refStruct;
    race: refStruct;
    equipped_item_level: number;
}

interface characterMythicKeystoneRun {
    completed_timestamp: number;
    duration: number;
    keystone_level: number;
    keystone_affixes: refStruct[];
    members: characterMythicKeystoneRunMember[];
    dungeon: refStruct;
    is_completed_within_time: boolean;
    mythic_rating: {
        color: rgbaColorStruct;
        rating: number;
    }
    map_rating: {
        color: rgbaColorStruct;
        rating: number;
    }    
}

export interface characterMythicKeystoneSeasonData {
    $id: number;
    links: linksStruct;
    season: idkeyStruct;
    best_runs: characterMythicKeystoneRun[];
}

interface characterProfession {
    profession: refStruct;
    tiers: {
        skill_points: number;
        max_skill_points: number;
        tier: idNameStruct;
        known_recipes: refStruct;
    }[];
    specialization?: {
        name: string;
    }
}

export interface characterProfessionData {
    links: linksStruct;
    character: characterRef;
    primaries: characterProfession[];
    secondaries : characterProfession[];
}

export interface characterPVPData {
    _links: linksStruct;
    brackets: hrefStruct[];
    honor_level: number;
    pvp_map_statistics: {
        world_map: idNameStruct;
        match_statistics: {
            played: number;
            won: number;
            lost: number;
        }
    }[];
    honorable_kills: number;
    character: characterRef;
}

export interface characterPVPBracketData {
    _links: linksStruct;
    character: characterRef;
    faction: factionStruct;
    bracket: {
        id: number;
        type: string;
    }
    rating: number;
    season: idkeyStruct;
    tier: idkeyStruct;
    season_match_statistics: {
        played: number;
        won: number;
        lost: number;
    };
    weekly_match_statistics: {
        played: number;
        won: number;
        lost: number;
    }
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
    //equipment
    $equipmentData: characterEquipmentData;
    //hunter pets
    $hunterPetsData: characterHunterPetsData;
    //media
    $mediaData: characterMediaData;
    //mythic keystones
    $mythicKeystoneData: characterMythicKeystoneSummaryData;
    $mythicKeystoneSeasons: characterMythicKeystoneSeasonData[];
    //professions
    $professionData: characterProfessionData;
    //pvp
    $pvpData: characterPVPData;
    $pvpBrackets: characterPVPBracketData[];
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
                apiClient.getCharacterEquipmentSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$equipmentData = data;
                }),       
                apiClient.getCharacterHunterPetsSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$hunterPetsData = data;
                }),
                apiClient.getCharacterMediaSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$mediaData = data;
                }),     
                apiClient.getCharacterMythicKeystoneProfileIndex(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$mythicKeystoneData = data;
                    //get each season
                    apiRec.$mythicKeystoneSeasons = new Array();
                    apiRec.$mythicKeystoneData.seasons.forEach((season)=>{
                        apiClient.getCharacterMythicKeystoneSeasonDetails(apiRec.realm.slug, Slugify(apiRec.name_search), season.id).then ((data: characterMythicKeystoneSeasonData | undefined) => {
                            if (data) {
                                data.$id - data.season.id;
                                apiRec.$mythicKeystoneSeasons.push(data);
                            }
                        })
                    })
                }), 
                apiClient.getCharacterProfessionSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$professionData = data!;
                }), 
                apiClient.getCharacterPvPSummary(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$pvpData = data!;
                    apiRec.$pvpData.brackets.forEach((bracket)=>{
                        //extract the bracket name from bracket.href
                        //e.g from "https://us.api.blizzard.com/profile/wow/character/wyrmrest-accord/gregmex/pvp-bracket/3v3?namespace=profile-us"
                        const regex = /\/([\w\d]*)\?/;
                        const matches = regex.exec(bracket.href);
                        const bracketName = matches![1];  //e.g "3v3"
                        apiClient.getCharacterPvPBracketStatistics(apiRec.realm.slug,Slugify(apiRec.name_search), bracketName)?.then((data)=>{
                            apiRec.$pvpBrackets.push(data!);
                        });                   
                    })
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