import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import {
    APICharacterHeirloomsCollectionSummary, APICharacterMountsCollectionSummary, APICharacterPetsCollectionSummary, APICharacterToysCollectionSummary,
    APICharacterTransmogCollectionSummary, APICharacterDungeons, APICharacterRaids, APICharacterEquipmentSummary, APICharacterAppearanceSummary,
    APICharacterAchievementsStatistics, APICharacterAchievementsSummary, APICharacterHunterPetsSummary, APICharacterMediaSummary,
    APICharacterMythicKeystoneProfileIndex, APICharacterMythicKeystoneSeasonDetails, APICharacterProfessionsSummary,
    APICharacterProfileSummary, APICharacterPvPBracketStatistics, APICharacterPvPSummary, APICharacterCompletedQuests, APICharacterQuests,
    APICharacterReputationsSummary, APICharacterSoulbinds, APICharacterSpecializationsSummary, APICharacterStatisticsSummary,
    APICharacterTitles
} from "battlenet-api-types";
import { dataStruct, apiSearchResponse, IApiDataDoc, IIndexItem, IApiIndexDoc } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";


export interface characterMythicKeystoneSeasonData extends APICharacterMythicKeystoneSeasonDetails {
    $id: number;
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
    $mediaData: APICharacterMediaSummary;
    //mythic keystones
    $mythicKeystoneData: APICharacterMythicKeystoneProfileIndex;
    $mythicKeystoneSeasons: characterMythicKeystoneSeasonData[];
    //professions
    $professions: APICharacterProfessionsSummary;
    //pvp
    $pvpData: APICharacterPvPSummary;
    $pvpBrackets: APICharacterPvPBracketStatistics[];
    //quests
    $quests: APICharacterQuests;
    $questsCompleted: APICharacterCompletedQuests;
    //reputations
    $reputation: APICharacterReputationsSummary;
    //soulbinds
    $soulbinds: APICharacterSoulbinds;
    //specializations
    $specializations: APICharacterSpecializationsSummary;
    //statistics
    $statistics: APICharacterStatisticsSummary;
    //titles
    $titles: APICharacterTitles;
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