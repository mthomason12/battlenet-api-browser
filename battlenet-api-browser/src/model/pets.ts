import { dataStruct, keyStruct, linksStruct, IApiIndexDoc, IApiDataDoc, refStruct, mediaStruct, mediaDataStruct } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIPet, APIPetAbilitiesIndex, APIPetAbility, APIPetIndex } from './api/pet';


export interface petData extends APIPet, IApiDataDoc {
  id: number;
  name: string;
  $mediaData: mediaDataStruct;
}

export interface petsIndex extends APIPetIndex, IApiIndexDoc {
}

export class petsDataDoc extends dbData<petsIndex, petData> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "pets";
    this.itemsName = "pets";
    this.type = "pets";
    this.title = "Pets";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<petsIndex> {
    return apiClient.getPetsIndex() as Promise<petsIndex>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<petData> {
    return apiClient.getPet(id) as Promise<petData>;
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: petData): Promise<void> {
    return new Promise((resolve) => {
      apiClient.getPetMedia(apiRec.id)?.then(
        (data: any) => {
          apiRec.$mediaData = data;
          resolve();
        });
    })

  }
}

export interface petAbilityData extends APIPetAbility, IApiDataDoc {
  id: number;
  name: string;
  $mediaData: mediaDataStruct;
}


export interface petAbilityIndex extends APIPetAbilitiesIndex, IApiIndexDoc {
}

export class petAbilitiesDataDoc extends dbData<petAbilityIndex, petAbilityData> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "pets";
    this.itemsName = "abilities";
    this.type = "pet-abilities";
    this.pathName = "pet-abilities";
    this.title = "Pet Abilities";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<petAbilityIndex> {
    return apiClient.getPetAbilitiesIndex() as Promise<petAbilityIndex>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<petAbilityData> {
    return apiClient.getPetAbility(id) as Promise<petAbilityData>;
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: petAbilityData): Promise<void> {
    return new Promise((resolve) => {
      apiClient.getPetAbilityMedia(apiRec.id)?.then(
        (data: any) => {
          apiRec.$mediaData = data;
          resolve();
        });
    })
  }


}