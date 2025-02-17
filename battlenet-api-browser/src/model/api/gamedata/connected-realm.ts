/**
 * Connected Realm API Return Types
 * @module
 */

import { APISearch, APISearchResult, hrefStruct, linksStruct, refStruct, regionedNameStruct } from "../shared";


/**
 * Connected Realms Index
 * 
 * /data/wow/connected-realm/index
 * 
 */
export interface APIConnectedRealmsIndex {
    _links: linksStruct;
    connected_realms: refStruct[];
}


/**
 * Connected Realm
 * 
 * /data/wow/connected-realm/{connectedRealmId}
 */
export interface APIConnectedRealm {
    _links: linksStruct;
    id: number;
    has_queue?: boolean;
    status?: {
        type?: string;
        name?: string;
    }
    population?: {
        type?: string;
        name?: string;
    }
    realms?: APIConnectedRealmItem[];
    mythic_leaderboards?: hrefStruct;
    auctions?: hrefStruct;
}

/**
 * Individual realm from @see APIConnectedRealm
 */
export interface APIConnectedRealmItem {
    id: number;
    region: refStruct;
    connected_realm: hrefStruct;
    name: string;
    category?: string;
    locale?: string;
    timezone?: string;
    type?: {
        type?: string;
        name?: string;
    }
    is_tournament?: boolean;
    slug: string;
}

/**
 * Connected Realm Search
 * 
 * /data/wow/search/connected-realm
 */
export interface APIConnectedRealmSearch extends APISearch {
    results: APIConnectedRealmSearchItem[];
}

export interface APIConnectedRealmSearchItem  extends APISearchResult {
    data: {
        realms: {
            is_tournament: boolean;
            timezone: string;
            name: regionedNameStruct;
            id: number;
            region: {
                name: regionedNameStruct;
                id: number;
            }
            category: regionedNameStruct;
            locale: string;
            type: {
                name: regionedNameStruct;
                type: string;
            }
            slug: string;
        }[]
        id: number;
        has_queue: boolean;
        status: {
            name: regionedNameStruct;
            type: string;
        }
        population: {
            name: regionedNameStruct;
            type: string;
        }        

    }
}