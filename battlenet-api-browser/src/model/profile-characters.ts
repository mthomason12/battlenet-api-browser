import { RecDB } from "../lib/recdb";
import { Slugify } from "../lib/utils";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { dataStruct, apiSearchResponse, linksStruct, genderStruct, factionStruct, refStruct, realmStruct, keyStruct, hrefStruct, IApiDataDoc, IIndexItem, IApiIndexDoc } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";


export interface characterProfileData extends IApiDataDoc {
    _links: linksStruct;
    _id: string;
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
}

export interface characterProfileIndexData extends IIndexItem, IApiIndexDoc{
    _id: string;
    id: number,
    name: string;
    faction: string;
    race: string;
    character_class: string;
    level: number;
    active_spec: string;
    realm: string;
    guild: string;
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
    override getAPISearch(api: apiClientService, searchParams: APISearchParams, params: object): Promise<apiSearchResponse<characterProfileData> | undefined> {
        var realm: string = Slugify(searchParams.find('realm')?.values[0]!);
        var character: string= Slugify(searchParams.find('character')?.values[0]!);
        return new Promise((resolve, reject)=>{
            if (realm && character) {
            api.getCharacterProfileSummary(realm, character).then((result)=>{
                if (result) {
                    result._id = Slugify(result.name)+'@'+result.realm.slug;
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
            _id: Slugify(item.name)+'@'+item.realm.slug,
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