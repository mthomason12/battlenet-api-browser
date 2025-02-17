/**
 * Character Encounters API
 * @module
 */

import { characterRef, hrefStruct, linksStruct, refStruct } from "../shared";


/**
 * Character Encounters Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/encounters 
 */
export interface APICharacterEncountersSummary {
    _links: linksStruct;
    character: characterRef;
    dungeons: hrefStruct;
    raids: hrefStruct;
}

/**
 * Character Dungeons
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/encounters/dungeons
 */
export interface APICharacterDungeons {
    _links: linksStruct;
    expansions: characterInstanceExpansionItem[];
}

/**
 * Character Raids
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/encounters/raids
 */
export interface APICharacterRaids {
    _links: linksStruct;
    expansions: characterInstanceExpansionItem[];
}

/**
 * Part of both @see APICharacterDungeons and @see APICharacterRaids
 */
export interface characterInstanceExpansionItem {
    expansion: refStruct;
    instances: {
        instance: refStruct;
        modes: {
            difficulty: {
                type: string;
                name: string;
            }
            status: {
                type: string;
                name: string;
            }
            progress: {
                completed_count: number;
                total_count: number;
                encounters: {
                    encounter: refStruct;
                    completed_count: number;
                    last_kill_timestamp: number;
                }[];
            }
        };
    }[];
}

