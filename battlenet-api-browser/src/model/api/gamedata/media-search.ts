/**
 * Media Search API Return Types
 * @module
 */

import { APISearch, APISearchResult, assetStruct } from "../shared";

/**
 * Media Search
 * /data/wow/search/media
 * 
 */
export interface APIMediaSearch extends APISearch {
    results: APIMediaSearchItem[];
}

export interface APIMediaSearchItem extends APISearchResult {
    data: {
        assets: assetStruct[];
        id: number;
    }
}