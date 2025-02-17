/**
 * Item API Return Types
 * @module
 */

import { APISearch, APISearchResult, hrefStruct, itemStatStruct, linksStruct, APIMediaStruct, mediaStruct, refStruct, regionedNameStruct, weaponStruct } from "../shared"

/**
 * Item
 * /data/wow/item/{itemId}
 * 
 */
export interface APIItem
{
    _links: linksStruct,
    id: number,
    name: string,
    quality: {
        type: string,
        name: string
    },
    level: number,
    required_level: number,
    media: mediaStruct,
    item_class: refStruct,
    item_subclass: refStruct,
    inventory_type: {
        type: string,
        name: string
    },
    purchase_price: number,
    sell_price: number,
    max_count: number,
    is_equippable: boolean,
    is_stackable: boolean,
    preview_item: {
        item: {
            key: hrefStruct,
            id: number
        },
        context: number,
        bonus_list: number[],
        quality: {
            type: string,
            name: string
        },
        name: string,
        media: mediaStruct,
        item_class: refStruct,
        item_subclass: refStruct,
        inventory_type: {
            type: string,
            name: string
        },
        binding: {
            type: string,
            name: string
        },
        unique_equipped: string,
        weapon?: weaponStruct,
        stats: itemStatStruct[],
        spells: {
            spell: refStruct,
            description: string
        }[],
        requirements: {
            level?: {
                value: number,
                display_string: string
            }
            playable_classes?: {
                links: hrefStruct;
                display_string: string;
            }
        },
        level?: {
            value: number,
            display_string: string
        },
        durability?: {
            value: number,
            display_string: string
        }
    },
    purchase_quantity: number,
    appearances: refStruct[]
}


/**
 * Item Search
 * /data/wow/search/item/
 * 
 */
export interface APIItemSearch extends APISearch {
    results: APIItemSearchItem[];
}

export interface APIItemSearchItem extends APISearchResult
{
    data: {
        level: number,
        required_level: number,
        sell_price: number,
        item_subclass: {
            name: regionedNameStruct,
            id: number
        }
        is_equippable: boolean,
        purchase_quantity: number,
        media: {
            id: number
        },
        item_class: {
            name: regionedNameStruct,
            id: number
        }
        quality: {
            name: regionedNameStruct,
            type: string
        }
        max_count: number,
        is_stackable: boolean,
        appearances?: { id: number }[],
        name: regionedNameStruct,
        purchase_price: number,
        id: number,
        inventory_type: {
            name: regionedNameStruct,
            type: string
        }
    }
}

/**
 * Item Media
 * /data/wow/media/item/{itemId}
 */
export interface APIItemMedia extends APIMediaStruct {    
}

/**
 * Item Classes Index
 * /data/wow/item-class/index
 */
export interface APIItemClassesIndex {
    _links: linksStruct;
    item_classes: refStruct[];
}

/**
 * Item Class
 * /data/wow/item-class/{itemClassId}
 */
export interface APIItemClass {
    _links: linksStruct;
    class_id: number;
    name: string;
    item_subclasses: refStruct[];
}

/**
 * Item Subclass
 * /data/wow/item-class/{itemClassId}/item-subclass/{itemSubclassId}
 */
export interface APIItemSubclass {
    _links: linksStruct;
    class_id: number;
    subclass_id: number;
    display_name: string;
    hide_subclass_in_tooltips?: boolean;
}


/**
 * Item Sets Index
 * /data/wow/item-set/index
 */
export interface APIItemSetsIndex {
    _links: linksStruct;
    item_sets: refStruct[];
}

/**
 * Item Set
 * /data/wow/item-set/{itemSetId}
 */
export interface APIItemSet {
    _links: linksStruct;
    id: number;
    name: string;
    items: refStruct[];
    effects: {
        display_string: string;
        required_count: number;
    }[]
    is_effect_active: boolean;
}

