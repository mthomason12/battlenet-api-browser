/**
 * Character Soulbinds API
 * @module
 */

import { linksStruct, characterRef, refStruct } from "../shared";

/**
 * Character Soulbinds
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/soulbinds 
 */
export interface APICharacterSoulbinds {
    _links: linksStruct;
    character: characterRef;
    chosen_covenant: refStruct;
    renown_level: number;
    soulbinds: {
        soulbind: refStruct;
        traits: (characterSoulbindTrait | characterSoulbindConduitSocket)[]
    }[]
}

export interface characterSoulbindTrait {
    trait: refStruct;
    tier: number;
    display_order: number;
}

export interface characterSoulbindConduitSocket {
    conduit_socket: {
        type: {
            name: string;
            type: string;
        }
        socket: {
            conduit: refStruct;
        }
        rank: number;
    }
    tier: number;
    display_order: number;
}
