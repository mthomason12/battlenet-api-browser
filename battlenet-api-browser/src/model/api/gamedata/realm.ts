/**
 * Realm API Return Types
 * @module
 */

import { APISearch, APISearchResult, hrefStruct, linksStruct, refStruct, regionedNameStruct } from "../shared";

/**
 * Realms Index
 * /data/wow/realm/index
 */
export interface APIRealmsIndex
{
  _links: linksStruct;
  realms: APIRealmsIndexEntry[];
}

/**
 * Individual index entry from @see APIRealmsIndex
 */
export interface APIRealmsIndexEntry extends refStruct
{
  slug: string;
}

/**
 * Realm
 * /data/wow/realm/{{realmId}}
 */
export interface APIRealm {
    _links: linksStruct;
    id: number;
    region: refStruct;
    connected_realm: hrefStruct;
    name: string;
    category: string;
    locale: string;
    timezone: string;
    type: {
        type: string;
        name: string;
    };
    is_tournament: boolean;
    slug: string;
}

/**
 * Realm Search
 * /data/wow/search/realm
 */
export interface APIRealmSearch extends APISearch {
    results: APIRealmSearchResult[];
}

export interface APIRealmSearchResult extends APISearchResult {
    id: number;
    is_tournament: string;
    timezone: string;
    name: regionedNameStruct;
    region: {
        name: regionedNameStruct
        id: number;
    }
    category: {
        name: regionedNameStruct;
    }
    locale: string;
    type: {
        name: regionedNameStruct
        type: string;
    }
    slug: string;
}



