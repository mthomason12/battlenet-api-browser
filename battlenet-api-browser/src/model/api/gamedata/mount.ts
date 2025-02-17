/**
 * Mount API Return Types
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
    source?: mountSourceStruct;
    faction?: factionStruct;
    requirements?: mountRequirementsStruct;
    should_exclude_if_uncollected?: boolean;
}

interface mountRequirementsStruct
{
  faction?: factionStruct;
  classes?: refStruct[];
}

interface mountDisplaysStruct
{
  key: hrefStruct;
  id: number;
}

interface mountSourceStruct
{
  type: string;
  name: string;
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