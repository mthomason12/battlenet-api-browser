import { apiDataDoc, apiIndexDoc, dataStruct, dbDataIndexOnly, IIndexItem, keyStruct, mediaStruct, refStruct } from './datastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { accountProfileSummaryLinks } from './account-characters';

interface qualityStruct {
    type: string;
    name: string;
}

interface accountPetsEntry extends apiDataDoc {
    id: number;
    species: refStruct;
    level: number;
    quality: qualityStruct;
    stats: {
        breed_id: number;
        health: number;
        power: number;
        speed: number;
    }
    is_favorite?: boolean;
    name?: string;
    creature_display: mediaStruct;
}

export interface accountPets extends apiIndexDoc
{
  _links: accountProfileSummaryLinks;
  pets: accountPetsEntry[];
  unlocked_battle_pet_slots: number;
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
        return apiClient.getAccountMountsCollectionsSummary() as Promise<accountPets>;
    }

    override getIndexItemName(item: IIndexItem): string
    {
        const itm = (item as accountPetsEntry);
        return `${itm.id}: (${itm.species.name}) ${itm.name}`;
    }
}