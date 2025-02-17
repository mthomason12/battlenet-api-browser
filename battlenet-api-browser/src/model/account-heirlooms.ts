import { IApiIndexDoc, dataStruct, IIndexItem } from './datastructs';
import { dbDataIndexOnly } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIAccountHeirloom, APIAccountHeirloomsCollectionSummary } from './api/private-profile/account-profile';


export interface accountHeirlooms extends APIAccountHeirloomsCollectionSummary, IApiIndexDoc {
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
        const itm = item as APIAccountHeirloom;
        return `${itm.heirloom.name} (Upgrade ${itm.upgrade.level})`;
    }
}