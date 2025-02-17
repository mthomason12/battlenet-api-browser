/**
 * Character Quests API
 * @module
 */

import { linksStruct, characterRef, refStruct } from "../shared";

/**
 * Character Quests
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/quests 
 */
export interface APICharacterQuests {
    _links: linksStruct;
    character: characterRef;
    in_progress: refStruct[];
}

/**
 * Character Completed Quests
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/quests 
 */
export interface APICharacterCompletedQuests {
    _links: linksStruct;
    character: characterRef;
    quests: refStruct[];
}