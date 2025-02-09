import { dataStruct, keyStruct, linksStruct, apiIndexDoc, apiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

interface realmType
{
  type: string;
  name: string;
}

interface realmRegion
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface realmData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  region: realmRegion;
  connected_realm: keyStruct;
  name: string;
  category: string;
  locale: string;
  timezone: string;
  type: realmType;
  is_tournament: boolean;
  slug: string;
}

interface realmIndexEntry
{
  key: keyStruct;
  name: string;
  id: number;
  slug: string;
}

export interface realmIndex extends apiIndexDoc
{
  _links: linksStruct;
  realms: realmIndexEntry[];
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