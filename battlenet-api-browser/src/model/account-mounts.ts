import { IApiIndexDoc, dataStruct, IIndexItem } from './datastructs';
import { dbDataIndexOnly } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIAccountMount, APIAccountMountsCollectionSummary } from './api/account-profile';


export interface accountMounts extends APIAccountMountsCollectionSummary, IApiIndexDoc {
}

export class accountMountsDataDoc extends dbDataIndexOnly<accountMounts>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "bedroom_baby";
        this.needsAuth = true;
        this.type = "account-mounts";
        this.itemsName = "mounts";
        this.title = "Mounts";
        this.hideKey = true;
        this.private = true;        
    }

    override getAPIIndex = function(apiClient: apiClientService): Promise<accountMounts>
    {
        return apiClient.getAccountMountsCollectionsSummary() as Promise<accountMounts>;
    }

    override getIndexItemName(item: IIndexItem): string
    {
        const itm = (item as APIAccountMount);
        return `${itm.mount.id}: ${itm.mount.name}`;
    }
}