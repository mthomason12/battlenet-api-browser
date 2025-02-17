/**
 * Region API Return Types
 * @module
 */

import { hrefStruct, linksStruct } from "../shared";


/**
 * Regions Index
 * /data/wow/region/index
 */
export interface APIRegionsIndex
{
  _links: linksStruct;
  regions: hrefStruct[];
}


/**
 * Region
 * /data/wow/region/{{realmId}}
 */
export interface APIRegion {
    _links: linksStruct;
    id: number;
    name: string;
    tag: string;
    patch_string: string;
}