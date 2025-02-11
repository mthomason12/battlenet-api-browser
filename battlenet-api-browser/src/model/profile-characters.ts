import { RecDB } from "../lib/recdb";
import { apiClientService } from "../services/apiclient.service";
import { dataStruct, apiSearchResponse, linksStruct, genderStruct, factionStruct, refStruct, realmStruct, keyStruct, hrefStruct, IApiDataDoc } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";


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
}

/**
 * Use a dbDataNoIndex as there's no index, but we're going to use a different method to search
 */
export class profileCharactersDataDoc extends dbDataNoIndex<characterProfileData, any, any>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "group";
        this.type = "profile-characters";
        this.title = "Characters";
        this.hideKey = true;
        //disable search as this requires a direct lookup
        this.isSearchable = false;
    }


    /**
     * There is no search available for characters
     * @param api 
     * @param searchParams 
     * @param params 
     * @returns 
     */
    override getAPISearch(api: apiClientService, searchParams:string, params: object): Promise<apiSearchResponse<any> | undefined> {
        return Promise.reject();
    }

    /**
     * There is no simple key-based API for retrieving characters
     * @param api 
     * @param id 
     * @returns 
     */
    override getAPIRec(api: apiClientService, id: number): Promise<characterProfileData | undefined> {
        return Promise.reject();
    }

    override makeIndexItem(item: any) {
        throw new Error("Method not implemented.");
    }
    
}