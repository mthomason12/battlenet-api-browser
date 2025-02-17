/**
 * Mount API Return Types
 * @module
 */

import { APISearch, APISearchResult, factionStruct, hrefStruct, linksStruct, refStruct, regionedNameStruct } from "../shared";


/**
 * Mount Index
 * /data/wow/mount/index
 */
export interface APIMountIndex {
    _links: linksStruct;
    mounts: refStruct[];
}


/**
 * Mount
 * /data/wow/mount/{{mountId}}
 */
export interface APIMount {
    _links: linksStruct;
    id: number;
    name?: string;
    description?: string;
    creature_displays?: mountDisplaysStruct[];
    source?: {
      type: string;
      name: string;
    };
    faction?: factionStruct;
    requirements?: {
      faction?: factionStruct;
      classes?: refStruct[];
    };
    should_exclude_if_uncollected?: boolean;
}

export interface mountDisplaysStruct
{
  key: hrefStruct;
  id: number;
}

/**
 * Mount Search
 * /data/wow/search/mount
 * 
 */
export interface APIMountSearch extends APISearch {
    results: APIMountSearchItem[];
}

export interface APIMountSearchItem extends APISearchResult {
    data: {
        creature_displays?: mountDisplaysStruct[];
        name: regionedNameStruct;
        id: number;
        source: {
            name: regionedNameStruct;
            type: string;
        }
    }
}