import { dataStruct, keyStruct, linksStruct, apiIndexDoc, apiDataDoc, refStruct, mediaStruct, mediaDataStruct } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';


interface petAbilityStruct
{
  ability: refStruct;
  slot: number;
  required_level?: number;
}

export interface petData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  name: string;
  battle_pet_type: {
    id: number
    type: string;
    name: string;
  } 
  description: string;
  is_capturable: boolean;
  is_tradable: boolean;
  is_battlepet: boolean;
  is_alliance_only: boolean;
  is_horde_only: boolean;
  abilities: petAbilityStruct[];
  source: {
    type: string;
    name: string;
  }
  icon: string;
  creature: refStruct;
  is_random_creature_display: boolean;
  media: mediaStruct;
  mediaData: mediaDataStruct;
}

interface petsIndexEntry
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface petsIndex extends apiIndexDoc
{
  _links: linksStruct;
  pets: petsIndexEntry[];
}

export class petsDataDoc extends dbData<petsIndex, petData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "pets";
    this.itemsName = "pets";
    this.type = "pets";
    this.title = "Pets";
}

  override getAPIIndex = function(apiClient: apiClientService): Promise<petsIndex>
  {
    return apiClient.getPetsIndex() as Promise<petsIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<petData>
  {
    return apiClient.getPet(id) as Promise<petData>;
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: petData): Promise<void> 
  {
    return new Promise((resolve)=>{
      apiClient.getPetMedia(apiRec.id)?.then(
        (data: any) => {
          apiRec.mediaData = data;
          resolve();
        });
    })

  }     
}

export interface petAbilityData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  name: string;
  battle_pet_type: {
    id: number
    type: string;
    name: string;
  } 
  rounds: number;
  media: mediaStruct;
  mediaData: mediaDataStruct;
}

interface petAbilityEntry
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface petAbilityIndex extends apiIndexDoc
{
  _links: linksStruct;
  abilities: petAbilityEntry[];
}

export class petAbilitiesDataDoc extends dbData<petAbilityIndex, petAbilityData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "pets";
    this.itemsName = "abilities";
    this.type = "pet-abilities";
    this.title = "Pet Abilities";
}

  override getAPIIndex = function(apiClient: apiClientService): Promise<petAbilityIndex>
  {
    return apiClient.getPetAbilitiesIndex() as Promise<petAbilityIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<petAbilityData>
  {
    return apiClient.getPetAbility(id) as Promise<petAbilityData>;
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: petAbilityData): Promise<void> 
  {
    return new Promise((resolve)=>{
      apiClient.getPetAbilityMedia(apiRec.id)?.then(
        (data: any) => {
          apiRec.mediaData = data;
          resolve();
        });
    })
  }     

  override myPath(): string {
    return "pet-abilities";
  }

}