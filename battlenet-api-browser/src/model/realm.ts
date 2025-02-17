import { dataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIRealm, APIRealmsIndex } from 'battlenet-api-types';

export interface realmIndex extends APIRealmsIndex, IApiIndexDoc {
}

export interface realmData extends APIRealm, IApiDataDoc{
  id: number;
  name: string;
}

export class realmsDataDoc extends dbData<realmIndex, realmData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "language";
    this.itemsName = "realms";
    this.type = "realms";
    this.key = "slug";
    this.stringKey = true;
    this.title = "Realms";
    this.hideKey = true;
}

  override getAPIIndex = function(apiClient: apiClientService): Promise<realmIndex>
  {
    return apiClient.getRealmIndex() as Promise<realmIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, slug: string): Promise<realmData>
  {
    return apiClient.getRealm(slug) as Promise<realmData>;
  }
}