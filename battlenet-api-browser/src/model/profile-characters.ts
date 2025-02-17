import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { APICharacterAchievementsStatistics, APICharacterAchievementsSummary } from "./api/profile/character-achievements";
import { APICharacterAppearanceSummary } from "./api/profile/character-appearance";
import { APICharacterHeirloomsCollectionSummary, APICharacterMountsCollectionSummary, APICharacterPetsCollectionSummary, APICharacterToysCollectionSummary, APICharacterTransmogCollectionSummary } from "./api/profile/character-collections";
import { APICharacterDungeons, APICharacterRaids } from "./api/profile/character-encounters";
import { APICharacterEquipmentSummary } from "./api/profile/character-equipment";
import { APICharacterHunterPetsSummary } from "./api/profile/character-hunter-pets";
import { APICharacterProfileSummary } from "./api/profile/character-profile";
import { spellTooltip } from "./api/shared";
import { dataStruct, apiSearchResponse, linksStruct, factionStruct, refStruct, hrefStruct, IApiDataDoc, IIndexItem, IApiIndexDoc, characterRef, idNameStruct, idkeyStruct, mediaStruct, rgbaColorStruct } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";


export interface characterMediaData {
    _links: linksStruct;
    character: characterRef;
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
    secondaries: characterProfession[];
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

export interface characterQuestData {
    _links: linksStruct;
    character: characterRef;
    in_progress: refStruct[];
}

export interface characterQuestCompletedData {
    _links: linksStruct;
    character: characterRef;
    quests: refStruct[];
}

export interface characterReputationData {
    _links: linksStruct;
    character: characterRef;
    reputations: {
        faction: refStruct;
        standing: {
            raw: number;
            value: number;
            max: number;
            tier?: number;
            name: string;
            renown_level?: number;
        }
        paragon?: {
            raw: number;
            value: number;
            max: number;
        }
    }[]
}

interface characterSoulbindTrait {
    trait: refStruct;
    tier: number;
    display_order: number;
}

interface characterSoulbindConduitSocket {
    conduit_socket: {
        type: {
            name: string;
            type: string;
        }
        socket: {
            conduit: refStruct;
        }
        rank: number;
    }
    tier: number;
    display_order: number;
}

export interface characterSoulbindData {
    _links: linksStruct;
    character: characterRef;
    chosen_covenant: refStruct;
    renown_level: number;
    soulbinds: {
        soulbind: refStruct;
        traits: (characterSoulbindTrait | characterSoulbindConduitSocket)[]
    }[]
}

interface characterSpecializationPVPTalent {
    selected: {
        talent: refStruct;
        spell_tooltip: spellTooltip;
    }
    slot_number: number;
}

interface characterSpecializationLoadout {
    is_active: boolean;
    talent_loadout_code: string;
    selected_class_talents: {
        id: number;
        rank: number;
        tooltip?: {
            talent: refStruct;
            spell_tooltip: spellTooltip;
        }
    }
}

export interface characterSpecializationData {
    _links: linksStruct;
    specializations: {
        specialization: refStruct;
        glyphs?: refStruct[];
        pvp_talent_slots?: characterSpecializationPVPTalent[];
        loadouts: characterSpecializationLoadout[];
    }[]
    active_specialization: refStruct;
    character: characterRef;
    active_hero_talent_tree: refStruct;
}

export interface characterStatisticsData {
    _links: linksStruct;
    health: number;
    power: number;
    power_type: refStruct;
    speed: {
        rating: number;
        rating_bonus: number;
    }
    strength: {
        base: number;
        effective: number;
    }
    agility: {
        base: number;
        effective: number;
    }
    intellect: {
        base: number;
        effective: number;
    }
    stamina: {
        base: number;
        effective: number;
    }
    melee_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    melee_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    mastery: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    bonus_armor: number;
    lifesteal: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    versatility: number;
    versatility_damage_done_bonus: number;
    versatility_healing_done_bonus: number;
    versatility_damage_taken_bonus: number;
    avoidance: {
        rating: number;
        rating_bonus: number;
    }
    attack_power: number;
    main_hand_damage_min: number;
    main_hand_damage_max: number;
    main_hand_speed: number;
    main_hand_dps: number;
    off_hand_damage_min: number;
    off_hand_damage_max: number;
    off_hand_speed: number;
    off_hand_dps: number;
    spell_power: number;
    spell_penetration: number;
    spell_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    mana_regen: number;
    mana_regen_combat: number;
    armor: {
        base: number;
        effective: number;
    }
    dodge: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    parry: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    block: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    ranged_crit: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    ranged_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    spell_haste: {
        rating: number;
        rating_bonus: number;
        value: number;
    }
    character: characterRef;
}

export interface characterTitleData {
    _links: linksStruct;
    character: characterRef;
    active_title?: refStruct;
    titles: refStruct[];
}

export interface characterProfileData extends APICharacterProfileSummary, IApiDataDoc {
    id: number;
    name: string;
    //additional data we've added to the API
    $id: string;
    $achievements: APICharacterAchievementsSummary;
    $achievementStatistics: APICharacterAchievementsStatistics;
    $appearanceData: APICharacterAppearanceSummary;
    //collections    
    $heirlooms: APICharacterHeirloomsCollectionSummary;
    $mountData: APICharacterMountsCollectionSummary;
    $petData: APICharacterPetsCollectionSummary;
    $toyData: APICharacterToysCollectionSummary;
    $transmogData: APICharacterTransmogCollectionSummary;
    //encounters
    $dungeonData: APICharacterDungeons;
    $raidData: APICharacterRaids;
    //equipment
    $equipment: APICharacterEquipmentSummary;
    //hunter pets
    $hunterPets: APICharacterHunterPetsSummary;
    //media
    $mediaData: characterMediaData;
    //mythic keystones
    $mythicKeystoneData: characterMythicKeystoneSummaryData;
    $mythicKeystoneSeasons: characterMythicKeystoneSeasonData[];
    //professions
    $professions: characterProfessionData;
    //pvp
    $pvpData: characterPVPData;
    $pvpBrackets: characterPVPBracketData[];
    //quests
    $quests: characterQuestData;
    $questsCompleted: characterQuestCompletedData;
    //reputations
    $reputation: characterReputationData;
    //soulbinds
    $soulbinds: characterSoulbindData;
    //specializations
    $specializations: characterSpecializationData;
    //statistics
    $statistics: characterStatisticsData;
    //titles
    $titles: characterTitleData;
}


export interface characterProfileIndexData extends IIndexItem, IApiIndexDoc {
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
export class profileCharactersDataDoc extends dbDataNoIndex<characterProfileData, characterProfileData, characterProfileIndexData> {

    constructor(parent: dataStruct, recDB: RecDB) {
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
        var character: string = Slugify(searchParams.find('character')?.values[0]!);
        return new Promise((resolve, reject) => {
            if (realm && character) {
                api.getCharacterProfileSummary(realm, character).then((result) => {
                    if (result) {
                        (result as characterProfileData).$id = Slugify(result.name) + '@' + result.realm.slug;
                    }
                    resolve(this.fakeSearchResponse(result as characterProfileData));
                });
            } else {
                resolve(this.fakeSearchResponse(undefined));
            }
        });
    }

    fakeSearchResponse(result: characterProfileData | undefined): apiSearchResponse<characterProfileData> {
        return {
            page: 1,
            pageSize: result ? 1 : 0,
            results: result ? [result] : []
        }
    }

    override getAPIExtra(apiClient: apiClientService, apiRec: characterProfileData): Promise<void> {
        return new Promise((resolve) => {
            Promise.allSettled([
                apiClient.getCharacterAchievementsSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$achievements = data;
                }),
                apiClient.getCharacterAchievementsStatistics(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$achievementStatistics = data;
                }),
                apiClient.getCharacterAppearanceSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$appearanceData = data;
                }),
                apiClient.getCharacterHeirlooms(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$heirlooms = data;
                }),
                apiClient.getCharacterMounts(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$mountData = data;
                }),
                apiClient.getCharacterPets(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$petData = data;
                }),
                apiClient.getCharacterToys(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$toyData = data;
                }),
                apiClient.getCharacterTransmogs(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$transmogData = data;
                }),
                apiClient.getCharacterDungeons(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$dungeonData = data;
                }),
                apiClient.getCharacterRaids(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$raidData = data;
                }),
                apiClient.getCharacterEquipmentSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$equipment = data;
                }),
                apiClient.getCharacterHunterPetsSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$hunterPets = data;
                }),
                apiClient.getCharacterMediaSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$mediaData = data;
                }),
                apiClient.getCharacterMythicKeystoneProfileIndex(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$mythicKeystoneData = data;
                    //get each season
                    apiRec.$mythicKeystoneSeasons = new Array();
                    apiRec.$mythicKeystoneData.seasons.forEach((season) => {
                        apiClient.getCharacterMythicKeystoneSeasonDetails(apiRec.realm.slug, Slugify(apiRec.name_search), season.id).then((data: characterMythicKeystoneSeasonData | undefined) => {
                            if (data) {
                                data.$id - data.season.id;
                                apiRec.$mythicKeystoneSeasons.push(data);
                            }
                        })
                    })
                }),
                apiClient.getCharacterProfessionSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$professions = data!;
                }),
                apiClient.getCharacterPvPSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$pvpData = data!;
                    apiRec.$pvpData.brackets.forEach((bracket) => {
                        //extract the bracket name from bracket.href
                        //e.g from "https://us.api.blizzard.com/profile/wow/character/wyrmrest-accord/gregmex/pvp-bracket/3v3?namespace=profile-us"
                        const regex = /\/([\w\d]*)\?/;
                        const matches = regex.exec(bracket.href);
                        const bracketName = matches![1];  //e.g "3v3"
                        apiClient.getCharacterPvPBracketStatistics(apiRec.realm.slug, Slugify(apiRec.name_search), bracketName)?.then((data) => {
                            apiRec.$pvpBrackets.push(data!);
                        });
                    })
                }),
                apiClient.getCharacterQuests(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$quests = data!;
                }),
                apiClient.getCharacterCompletedQuests(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$questsCompleted = data!;
                }),
                apiClient.getCharacterReputationsSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$reputation = data!;
                }),
                apiClient.getCharacterSoulbinds(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$soulbinds = data!;
                }),
                apiClient.getCharacterSpecializationsSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$specializations = data!;
                }),
                apiClient.getCharacterStatisticsSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$statistics = data!;
                }),
                apiClient.getCharacterTitlesSummary(apiRec.realm.slug, Slugify(apiRec.name_search))?.then((data) => {
                    apiRec.$titles = data!;
                })
            ]).then(() => {
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
        [character, realm] = id.split('@');
        return (api.getCharacterProfileSummary(realm, character) as Promise<characterProfileData>);
    }

    override makeIndexItem(item: characterProfileData): characterProfileIndexData {
        return {
            $id: Slugify(item.name) + '@' + item.realm.slug,
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