/**
 * Character Mythic Keystone API
 * @module
 */

import { characterRef, idkeyStruct, linksStruct, refStruct, rgbaColorStruct } from "../shared";


/**
 * Character Mythic Keystone Profile Index
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/mythic-keystone-profile
 */
export interface APICharacterMythicKeystoneProfileIndex {
    _links: linksStruct;
    current_period: {
        period: idkeyStruct;
    }
    seasons: idkeyStruct[];
    character: characterRef;
    current_mythic_rating: {
        color: rgbaColorStruct;
        rating: number;
    }
}

/**
 * Character Mythic Keystone Season Details
 *  
 * /profile/wow/character/{realmSlug}/{characterName}/mythic-keystone-profile/season/{seasonId}
 */
export interface APICharacterMythicKeystoneSeasonDetails {
    $id: number;
    links: linksStruct;
    season: idkeyStruct;
    best_runs: {
        completed_timestamp: number;
        duration: number;
        keystone_level: number;
        keystone_affixes: refStruct[];
        members: {
            character: characterRef;
            specialization: refStruct;
            race: refStruct;
            equipped_item_level: number;
        };
        dungeon: refStruct;
        is_completed_within_time: boolean;
        mythic_rating: {
            color: rgbaColorStruct;
            rating: number;
        }
        map_rating: {
            color: rgbaColorStruct;
            rating: number;
        }
    }[]; 

}

