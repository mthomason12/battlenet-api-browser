import { hrefStruct, linksStruct, mediaDataStruct, mediaStruct, refStruct } from "./shared";

/**
 * Auction House API Return Types
 */

/**
 * Auctions
 * /data/wow/connected-realm/{connectedRealmId}/auctions
 * 
 */
export interface APIAuctions {
   _links: linksStruct;
   connected_realm: hrefStruct;
   auctions: APIAuctionsItem[];
}

/**
 * Individual auction from @see APIAuctions
 */
export interface APIAuctionsItem {
    id: number;
    item: {
        id: number;
        context: number;
        bonus_lists?: number[];
        modifiers?:{
            type: number;
            value: number;
        }[];
    }
    buyout: number;
    quantity: number;
    time_left: string;
}

/**
 * Commodities
 * /data/wow/auctions/commodities
 * 
 * This currently appears to be broken, returning a truncated result
 */
export interface APICommodities {
    
}