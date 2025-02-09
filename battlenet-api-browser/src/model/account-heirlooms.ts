import { IApiDataDoc, IApiIndexDoc, dataStruct, IIndexItem, refStruct } from './datastructs';
import { dbDataIndexOnly } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { accountProfileSummaryLinks } from './account-characters';


interface accountHeirloomsEntry extends IApiDataDoc {
    heirloom: refStruct;
    upgrade: {
        level: number;
    }
}

export interface accountHeirlooms extends IApiIndexDoc
{
  _links: accountProfileSummaryLinks;
  heirlooms: accountHeirloomsEntry[]
}


export class accountHeirloomsDataDoc extends dbDataIndexOnly<accountHeirlooms>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "emoji_events";
        this.needsAuth = true;
        this.type = "account-heirlooms";
        this.itemsName = "heirlooms";
        this.title = "Heirlooms";
        this.hideKey = true;
        this.private = true;        
    }

    override getAPIIndex = function(apiClient: apiClientService): Promise<accountHeirlooms>
    {
        return apiClient.getAccountHeirloomsCollectionsSummary() as Promise<accountHeirlooms>;
    }

    override getIndexItemName(item: IIndexItem): string
    {
        const itm = (item as accountHeirloomsEntry);
        return `${itm.heirloom.name} (Upgrade ${itm.upgrade.level})`;
    }
}