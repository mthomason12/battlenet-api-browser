/**
 * Character PvP API
 * @module
 */

import { linksStruct, hrefStruct, idNameStruct, characterRef, factionStruct, idkeyStruct } from "../shared";


/**
 * Character PvP Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/pvp-summary
 */
export interface APICharacterPvPSummary {
    _links: linksStruct;
    brackets: hrefStruct[];
    honor_level: number;
    pvp_map_statistics: {
        world_map: idNameStruct;
        match_statistics: {
            played: number;
            won: number;
            lost: number;
        }
    }[];
    honorable_kills: number;
    character: characterRef;
}


/**
 * Character PvP Bracket Statistics
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/pvp-bracket/{pvpBracket} 
 */
export interface APICharacterPvPBracketStatistics {
    _links: linksStruct;
    character: characterRef;
    faction: factionStruct;
    bracket: {
        id: number;
        type: string;
    }
    rating: number;
    season: idkeyStruct;
    tier: idkeyStruct;
    season_match_statistics: {
        played: number;
        won: number;
        lost: number;
    };
    weekly_match_statistics: {
        played: number;
        won: number;
        lost: number;
    }
}