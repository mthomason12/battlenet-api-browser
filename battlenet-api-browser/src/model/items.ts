import { RecDB } from "../lib/recdb";
import { apiClientService } from "../services/apiclient.service";
import { APISearchParams } from "../services/apisearch";
import { APIItem, APIItemSearchItem } from "battlenet-api-types";
import { apiSearchResponse, dataStruct, IApiDataDoc, IApiIndexDoc, IIndexItem } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";

export interface itemData extends APIItem, IApiDataDoc
{
    id: number;
    name: string;
}

export interface itemSearchData extends APIItemSearchItem, IApiIndexDoc
{ }

export interface itemIndexData extends IIndexItem{
    id: number,
    name: string,
    quality: string,
    is_equippable: boolean;
    inventory_type: string
}

export class itemsDataDoc extends dbDataNoIndex<itemSearchData, itemData, itemIndexData>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "inventory_2";
        this.type = "items";
        this.title = "Items";
    }

    override postProcessSearchResults(results: itemSearchData[]): itemSearchData[] {
        return results.map((item)=>{
            item.id = item.data.id;
            item.name = item.data.name.en_US;
            return item;
        })
    }

    override getAPISearch(api: apiClientService, searchParams:APISearchParams, params: object): Promise<apiSearchResponse<itemSearchData> | undefined> {
        return api.getItemSearch(searchParams) as Promise<apiSearchResponse<itemSearchData>>;
    }

    override getAPIRec(api: apiClientService, id: number): Promise<itemData | undefined> {
        return api.getItem(id) as Promise<itemData>;
    }

    override makeIndexItem(item: itemData): itemIndexData {
        return {
            id: item.id,
            name: item.name,
            quality: item.quality.type,
            is_equippable: item.is_equippable,
            inventory_type: item.inventory_type.type
        }
    }
    
}