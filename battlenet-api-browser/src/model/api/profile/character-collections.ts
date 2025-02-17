/**
 * Character Collections API
 * @module
 */

import { characterRef, hrefStruct, idkeyStruct, linksStruct, refStruct } from "../shared";


/**
 * Character Collections Index
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/collections 
 */
export interface APICharacterCollectionsIndex {
    _links: linksStruct;
    pets: hrefStruct;
    mounts: hrefStruct;
    heirlooms: hrefStruct;
    toys: hrefStruct;
    character: characterRef;
}

/**
 * Character Heirlooms Collection Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/collections/heirlooms
 */
export interface APICharacterHeirloomsCollectionSummary {
    _links: linksStruct;
    heirlooms: {
        heirloom: refStruct;
        upgrade: {
            level: number;
        }[];
    }[]
}

/**
 * Character Mounts Collection Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/collections/mounts
 */
export interface APICharacterMountsCollectionSummary {
    _links: linksStruct;
    mounts: {
        mount: refStruct;
        is_useable: boolean;
        is_favorite?: boolean;
    }[];
}

/**
 * Character Pets Collection Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/collections/pets
 */
export interface APICharacterPetsCollectionSummary {
    _links: linksStruct;
    pets: {
        species: refStruct;
        level: number;
        quality: {
            type: string;
            name: string;
        }
        stats: {
            breed_id: number;
            health: number;
            power: number;
            speed: number;
        }
        name: string;
        creature_display: idkeyStruct;
        is_favorite?: boolean;
        id: number;
    }[];
}

/**
 * Character Toys Collection Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/collections/toys
 */
export interface APICharacterToysCollectionSummary {
    _links: linksStruct;
    toys: {
        toy: refStruct;
        is_favorite?: boolean;
    }[];
}


/**
 * Character Transmog Collection Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/collections/transmogs
 */
export interface APICharacterTransmogCollectionSummary {
    _links: linksStruct;
    appearance_sets: refStruct[];
    slots: {
        slot: {
            type: string;
            name: string;
        }
        appearances: refStruct;
    }[];
}