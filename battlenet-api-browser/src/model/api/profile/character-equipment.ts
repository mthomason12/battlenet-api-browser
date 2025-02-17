/**
 * Character Equipment API
 * @module
 */

import { linksStruct, characterRef, hrefStruct, mediaStruct, refStruct, rgbaColorStruct } from "../shared";


/**
 * Character Equipment Summary
 * 
 * /profile/wow/character/{realmSlug}/{characterName}/equipment 
 */
export interface APICharacterEquipmentSummary {
    _links: linksStruct;
    character: characterRef;
    equipped_items: characterEquippedItem[];
}

export interface characterEquippedItem {
    item: refStruct;
    sockets: characterEquippedItemSocket[];
    slot: {
        name: string;
        type: string;
    }
    quantity: number;
    context: number;
    bonus_list: number[];
    quality: {
        name: string;
        type: string;
    }
    name: string;
    modified_appearance_id: number;
    media: mediaStruct;
    item_class: refStruct;
    item_subclass: refStruct;
    inventory_type: {
        name: string;
        type: string;
    }
    binding: {
        name: string;
        type: string;
    }
    armor: {
        value: number;
        display: {
            display_string: string;
            color: rgbaColorStruct;
        }
    }
    stats: characterEquippedItemStat[];
    sell_price?: {
        value: number;
        display_strings: {
            header: string;
            gold: string; //yes, these ARE strings here
            silver: string;
            copper: string;
        }
    }
    requirements?: {
        level?: {
            value: number,
            display_string: string
        }
        playable_classes?: {
            links: hrefStruct;
            display_string: string;
        }
    }
    set?: {
        item_set: refStruct;
        items: {
            item: refStruct;
            is_equipped?: boolean;
        }[];
        effects: {
            display_string: string;
            required_count: number;
            is_active: boolean;
        }[];
    }
    level: {
        value: number;
        display_string: string;
    }
    transmog: {
        item: refStruct;
        display_string: string;
        item_modified_appearance_id: number;
    }
    durability: {
        value: number;
        display_string: string;
    }
}

export interface characterEquippedItemSocket {
    socket_type: {
        name: string;
        type: string;
    }
    item: refStruct;
    display_string: string;
    media: mediaStruct;
}

export interface characterEquippedItemStat {
    type: {
        name: string;
        type: string;
    }
    value: number;
    display: {
        display_string: string;
        color: rgbaColorStruct;
    }
}