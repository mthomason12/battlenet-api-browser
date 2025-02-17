import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { APIGuild, APIGuildAchievements, APIGuildActivity, APIGuildRoster } from "./api/profile/guild";
import { apiSearchResponse, dataStruct, IApiDataDoc, IApiIndexDoc, IIndexItem } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";

export interface guildProfileData extends APIGuild, IApiDataDoc {
    id: number;
    name: string;
    //extra data we're appending to the API record
    $id: string;
    $activityData?: APIGuildActivity;
    $achievementData?: APIGuildAchievements;
    $rosterData?: APIGuildRoster;
}

export interface guildProfileIndexData extends IIndexItem, IApiIndexDoc {
    id: number,
    name: string;
    faction: string;
    achievement_points: number;
    member_count: number;
    realm: string;
    $id: string;    
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
    override getAPISearch(api: apiClientService, searchParams: APISearchParams, params: object): Promise<apiSearchResponse<guildProfileData> | undefined> {
        var realm: string = Slugify(searchParams.find('realm')?.values[0]!);
        var guild: string= Slugify(searchParams.find('guild')?.values[0]!);
        return new Promise((resolve, reject)=>{
            if (realm && guild) {
            api.getGuild(realm, guild).then((result)=>{
                if (result) {
                    const res = result as guildProfileData;
                    res.$id = Slugify(res.name)+'@'+res.realm.slug;
                    resolve(this.fakeSearchResponse(res));
                }
                resolve(this.fakeSearchResponse(undefined));
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
        return (api.getGuild(realm, guild) as Promise<guildProfileData>);
    }

    override makeIndexItem(item: guildProfileData): guildProfileIndexData {
        return {
            $id: Slugify(item.name)+'@'+item.realm.slug,
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