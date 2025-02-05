import { apiDataDoc, apiIndexDoc, dataStruct, dbDataIndexOnly, IIndexItem, refStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { accountProfileSummaryLinks } from './account-characters';


interface accountHeirloomsEntry extends apiDataDoc {
    heirloom: refStruct;
    upgrade: {
        level: number;
    }
}

export interface accountHeirlooms extends apiIndexDoc
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

    override getAPIIndex = function(apiClient: ApiclientService): Promise<accountHeirlooms>
    {
        return apiClient.getAccountHeirloomsCollectionsSummary() as Promise<accountHeirlooms>;
    }

    override getIndexItemName(item: IIndexItem): string
    {
        const itm = (item as accountHeirloomsEntry);
        return `${itm.heirloom.name} (Upgrade ${itm.upgrade.level})`;
    }
}