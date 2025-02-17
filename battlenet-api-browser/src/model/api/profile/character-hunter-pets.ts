/**
 * Character Hunter Pets API
 * @module 
 */

import { linksStruct, characterRef, refStruct, idkeyStruct } from "../shared";

/**
 * Hunter Pets Summary 
 * 
 * /profile/wow/character/{realmSlug}/{characterName}
 */
export interface APICharacterHunterPetsSummary {
    _links: linksStruct;
    character: characterRef;
    hunter_pets: {
        id: number;
        name: string;
        level: number;
        creature: refStruct;
        slot: number;
        creature_display: idkeyStruct;
    };
}