import { dataStruct, mediaDataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APICovenant, APICovenantIndex, APISoulbindIndex } from './api/covenants';

//#region Covenants

export interface covenantData extends APICovenant, IApiDataDoc {
  id: number;
  name: string;
  $mediaData?: mediaDataStruct;
}


export interface covenantIndexData extends APICovenantIndex, IApiIndexDoc {
}


export class covenantsDataDoc extends dbData<covenantIndexData, covenantData> {

  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.itemsName = "covenants";
    this.type = "covenants";
    this.title = "Covenants";
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: covenantData): Promise<void> {
    return new Promise((resolve) => {
      apiClient.getCovenantMedia(apiRec.id)?.then((data: any) => {
        apiRec.$mediaData = data;
        resolve();
      });
    })
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<covenantIndexData> {
    return apiClient.getCovenantIndex() as Promise<covenantIndexData>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<covenantData> {
    return apiClient.getCovenant(id) as Promise<covenantData>;
  }

}

//#endregion

//#region Soulbinds


export interface soulbindData extends APISoulbindIndex, IApiDataDoc {
}

interface soulbindIndexData extends APISoulbindIndex, IApiIndexDoc {
}


export class soulbindsDataDoc extends dbData<soulbindIndexData, soulbindData> {
  
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "people";
    this.itemsName = "soulbinds";
    this.type = "soulbinds";
    this.title = "Soulbinds";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<soulbindIndexData> {
    return apiClient.getSoulbindIndex() as Promise<soulbindIndexData>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<soulbindData> {
    return apiClient.getSoulbind(id) as Promise<soulbindData>;
  }

}


//#endregion