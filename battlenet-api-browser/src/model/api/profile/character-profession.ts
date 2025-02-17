/**
 * Character Profession API
 * @module
 */

import { refStruct, idNameStruct, linksStruct, characterRef } from "../shared";

/**
 * Character Professions Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/professions 
 */
export interface APICharacterProfessionsSummary {
    links: linksStruct;
    character: characterRef;
    primaries: characterProfession[];
    secondaries: characterProfession[];
}

export interface characterProfession {
    profession: refStruct;
    tiers: {
        skill_points: number;
        max_skill_points: number;
        tier: idNameStruct;
        known_recipes: refStruct;
    }[];
    specialization?: {
        name: string;
    }
}