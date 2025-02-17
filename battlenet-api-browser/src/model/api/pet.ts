/**
 * Pet API Return Types
 */

import { APIMediaStruct, linksStruct, mediaStruct, refStruct } from "./shared";

//region Pets

/**
 * Pets Index
 * /data/wow/pet/index
 */
export interface APIPetIndex {
    _links: linksStruct;
    mounts: refStruct[];
}


/**
 * Pet
 * /data/wow/pet/{{petId}}
 */
export interface APIPet {
    _links: linksStruct;
    id: number;
    name: string;
    battle_pet_type: {
        id: number
        type: string;
        name: string;
    }
    description: string;
    is_capturable: boolean;
    is_tradable: boolean;
    is_battlepet: boolean;
    is_alliance_only: boolean;
    is_horde_only: boolean;
    abilities: petAbilityStruct[];
    source: {
        type: string;
        name: string;
    }
    icon: string;
    creature: refStruct;
    is_random_creature_display: boolean;
    media: mediaStruct;
}

interface petAbilityStruct {
    ability: refStruct;
    slot: number;
    required_level?: number;
}

/**
 * Pets Index
 * /data/wow/pet/index
 */
export interface APIPetIndex {
    _links: linksStruct;
    mounts: refStruct[];
}

//region Pet Media

/**
 * Pet Media
 * /data/wow/media/pet/{{petId}}
 */
export interface APIPetMedia extends APIMediaStruct {
}

//region Pet Abilities

/**
 * Pet Abilities Index
 * /data/wow/pet-ability/index
 */
export interface APIPetAbilitiesIndex {
    _links: linksStruct;
    mounts: refStruct[];
}

/**
 * Pet Ability
 * /data/wow/pet-ability/{{petAbilityId}}
 */
export interface APIPetAbility {
    _links: linksStruct;
    id: number;
    name: string;
    battle_pet_type: {
        id: number
        type: string;
        name: string;
    }
    rounds: number;
    media: mediaStruct;
}

/**
 * Pet Media
 * /data/wow/media/pet-ability/{{petAbilityId}}
 */
export interface APIPetAbilityMedia extends APIMediaStruct {
}
