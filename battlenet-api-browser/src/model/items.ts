import { RecDB, recID } from "../lib/recdb";
import { apiClientService } from "../services/apiclient.service";
import { apiSearchResponse, dataStruct, IApiDataDoc, IApiIndexDoc } from "./datastructs";
import { dbDataNoIndex } from "./dbdatastructs";

interface itemData extends IApiDataDoc
{
}

interface itemIndexData extends IApiIndexDoc
{
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

    override getAPISearch(api: apiClientService, searchParams:string, params: object): Promise<apiSearchResponse<itemIndexData> | undefined> {
        throw new Error("Method not implemented.");
    }

    override getAPIRec(api: apiClientService, id: recID): Promise<itemData | undefined> {
        throw new Error("Method not implemented.");
    }
    
}