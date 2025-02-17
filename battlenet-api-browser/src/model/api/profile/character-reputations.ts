/**
 * Character Reputations API
 * @module
 */

import { linksStruct, characterRef, refStruct } from "../shared";

/**
 * Character Reputations Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/reputations 
 */
export interface APICharacterReputationsSummary {
    _links: linksStruct;
    character: characterRef;
    reputations: {
        faction: refStruct;
        standing: {
            raw: number;
            value: number;
            max: number;
            tier?: number;
            name: string;
            renown_level?: number;
        }
        paragon?: {
            raw: number;
            value: number;
            max: number;
        }
    }[]
}