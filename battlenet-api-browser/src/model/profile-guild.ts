import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { apiSearchResponse, characterRef, dataStruct, factionStruct, hrefStruct, IApiDataDoc, IApiIndexDoc, idkeyStruct, IIndexItem, keyStruct, linksStruct, mediaStruct, realmStruct, refStruct, rgbaColorStruct } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";

interface guildRosterMemberStruct {
    character: {
        key: keyStruct;
        name: string;
        id: number;
        realm: realmStruct;
        level: number;
        playable_class: idkeyStruct;
        playable_race: idkeyStruct;
    }
    rank: number;
}

export interface guildRosterData {
    _links: linksStruct;
    guild: {
        key: keyStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    members: guildRosterMemberStruct[];
}

interface guildAchievementCriteriaStruct {
    id: number;
    amount?: number;
    is_completed: boolean;
    child_criteria?: guildAchievementCriteriaStruct[]
}

interface guildAchievement {
    id: number;
    achievement: refStruct;
    criteria?: guildAchievementCriteriaStruct;
    completed_timestamp: number;
}

export interface guildAchievementData {
    _links: linksStruct;
    guild: {
        key: keyStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    total_quantity: number;
    total_points: number;
    achievements: guildAchievement []
}

interface guildActivity {
    activity: {
        type: string;
    }
    timestamp: number;
}

interface guildEncounterActivity extends guildActivity{
    encounter_completed: {
        encounter: refStruct;
        mode: {
            type: string;
            name: string;
        }
    }
}

interface guildCharacterAchievementActivity extends guildActivity {
    character_achievement: {
        character: characterRef;
        achievement: refStruct;
    }
}

export interface guildActivityData {
    _links: linksStruct;
    guild: {
        key: keyStruct;
        id: number;
        name: string;
        faction: factionStruct;
        realm: realmStruct;
    }
    activities: guildEncounterActivity | guildCharacterAchievementActivity []
}


interface guildCrestStruct {
    emblem: {
        id: number;
        media: mediaStruct;
        color: {
            id: number;
            rgba: rgbaColorStruct;
        }
    };
    border: {
        id: number;
        media: mediaStruct;
        color: {
            id: number;
            rgba: rgbaColorStruct;
        }
    };
    background: {
        color: {
            id: number,
            rgba: rgbaColorStruct;
        }
    };
}


export interface guildProfileData extends IApiDataDoc {
    _links: linksStruct;
    id: number;
    name: string;
    faction: factionStruct;
    achievement_points: number;
    member_count: number;
    realm: realmStruct;
    crest: guildCrestStruct;
    roster: hrefStruct;
    achievements: hrefStruct;
    created_timestamp: number;
    activity: hrefStruct;
    name_search: string;
    //extra data we're appending
    _id: string;
    $activityData?: guildActivityData;
    $achievementData?: guildAchievementData;
    $rosterData?: guildRosterData;

}

export interface guildProfileIndexData extends IIndexItem, IApiIndexDoc {
    _id: string;
    id: number,
    name: string;
    faction: string;
    achievement_points: number;
    member_count: number;
    realm: string;
}

/**
 * Use a dbDataNoIndex as there's no index, but we're going to override search because we can only look for individual characters
 * in the API.
 */
export class profileGuildDataDoc extends dbDataNoIndex<guildProfileData, guildProfileData, guildProfileIndexData>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "security";
        this.type = "profile-guilds";
        this.pathName = "guilds";
        this.title = "Guilds";
        this.stringKey = true;
        this.key = "_id"; //override key because we're making our own from 
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
    override getAPISearch(api: apiClientService, searchParams: APISearchParams, params: object): Promise<apiSearchResponse<guildProfileData> | undefined> {
        var realm: string = Slugify(searchParams.find('realm')?.values[0]!);
        var guild: string= Slugify(searchParams.find('guild')?.values[0]!);
        return new Promise((resolve, reject)=>{
            if (realm && guild) {
            api.getGuild(realm, guild).then((result)=>{
                if (result) {
                    result._id = Slugify(result.name)+'@'+result.realm.slug;
                }
                resolve(this.fakeSearchResponse(result));
            }); } else {
                resolve(this.fakeSearchResponse(undefined));
            }
        });
    }

    fakeSearchResponse(result: guildProfileData|undefined): apiSearchResponse<guildProfileData>
    {
        return {
            page: 1,
            pageSize: result ? 1 : 0,
            results: result ? [result] : []
        }
    }

    override getAPIExtra(apiClient: apiClientService, apiRec: guildProfileData): Promise<void> {
        return new Promise((resolve)=>{
            Promise.allSettled([
                apiClient.getGuildAchievements(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$achievementData = data;
                  }),
                  apiClient.getGuildActivity(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$activityData = data;
                  }),                  
                  apiClient.getGuildRoster(apiRec.realm.slug,Slugify(apiRec.name_search))?.then((data: any) => {
                    apiRec.$rosterData = data;
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
    override getAPIRec(api: apiClientService, id: string): Promise<guildProfileData | undefined> {
        var realm: string;
        var guild: string;
        [guild,realm] = id.split('@');
        return api.getGuild(realm, guild);
    }

    override makeIndexItem(item: guildProfileData): guildProfileIndexData {
        return {
            _id: Slugify(item.name)+'@'+item.realm.slug,
            id: item.id,
            name: item.name,
            faction: item.faction.type,
            realm: item.realm.name,
            achievement_points: item.achievement_points,
            member_count: item.member_count,
            lastUpdate: Date.now()
        }
    }
    
}