import { dataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIMount, APIMountIndex } from 'battlenet-api-types';


export interface mountData extends APIMount, IApiDataDoc {
  id: number;
  name: string;
}

export interface mountsIndex extends APIMountIndex, IApiIndexDoc {
}

export class mountsDataDoc extends dbData<mountsIndex, mountData> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "bedroom_baby";
    this.type = "mounts";
    this.itemsName = "mounts";
    this.title = "Mounts";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<mountsIndex> {
    return apiClient.getMountIndex() as Promise<mountsIndex>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<mountData> {
    return apiClient.getMount(id) as Promise<mountData>;
  }
}