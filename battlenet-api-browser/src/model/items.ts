import { RecDB } from "../lib/recdb";
import { apiClientService } from "../services/apiclient.service";
import { apiSearchResponse, dataStruct, IApiDataDoc, IApiIndexDoc, itemStatsStruct, keyStruct, linksStruct, mediaStruct, refStruct, regionedNameStruct, weaponStruct } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";

export interface itemData extends IApiDataDoc
{
    _links: linksStruct
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
            key: keyStruct,
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
        stats: itemStatsStruct,
        spells: {
            spell: refStruct,
            description: string
        }[],
        requirements: {
            level?: {
                value: number,
                display_string: string
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

export interface itemIndexData extends IApiIndexDoc
{
    key: keyStruct;
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

export class itemsDataDoc extends dbDataNoIndex<itemIndexData, itemData>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "inventory_2";
        this.type = "items";
        this.title = "Items";
    }

    override postProcessSearchResults(results: itemIndexData[]): itemIndexData[] {
        return results.map((item)=>{
            item.id = item.data.id;
            item.name = item.data.name.en_US;
            return item;
        })
    }

    override getAPISearch(api: apiClientService, searchParams:string, params: object): Promise<apiSearchResponse<itemIndexData> | undefined> {
        return api.getItemSearch(searchParams) as Promise<apiSearchResponse<itemIndexData>>;
    }

    override getAPIRec(api: apiClientService, id: number): Promise<itemData | undefined> {
        return api.getItem(id) as Promise<itemData>;
    }
    
}