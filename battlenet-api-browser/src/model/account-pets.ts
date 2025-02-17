import { IApiDataDoc, IApiIndexDoc, dataStruct, IIndexItem } from './datastructs';
import { dbDataIndexOnly } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIAccountPet, APIAccountPetsCollectionSummary } from 'battlenet-api-types';


export interface accountPets extends APIAccountPetsCollectionSummary, IApiIndexDoc {
}


export class accountPetsDataDoc extends dbDataIndexOnly<accountPets>
{

    constructor(parent: dataStruct, recDB: RecDB)
    {
        super(parent, recDB);
        this.icon = "pets";
        this.needsAuth = true;
        this.type = "account-pets";
        this.itemsName = "pets";
        this.title = "Pets";
        this.hideKey = true;
        this.private = true;        
    }

    override getAPIIndex = function(apiClient: apiClientService): Promise<accountPets>
    {
        return apiClient.getAccountPetsCollectionsSummary() as Promise<accountPets>;
    }

    override getIndexItemName(item: IIndexItem): string
    {
        const itm = (item as APIAccountPet);
        return `${itm.id}: (${itm.species.name}) ${itm.name}`;
    }
}