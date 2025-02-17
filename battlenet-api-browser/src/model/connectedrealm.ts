import { dataStruct, hrefStruct, IApiIndexDoc, IApiDataDoc, IIndexItem } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIConnectedRealmsIndex, APIConnectedRealm } from 'battlenet-api-types';


export interface connectedRealmData extends APIConnectedRealm, IApiDataDoc {
  id: number;
  name: string;
}

interface connectedRealmIndexItem extends IIndexItem, hrefStruct {
}

export interface connectedRealmIndex extends IApiIndexDoc, APIConnectedRealmsIndex {
}

export class connectedRealmsDataDoc extends dbData<connectedRealmIndex, connectedRealmData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "hub";
    this.itemsName = "connected_realms";
    this.type="connected-realms";
    this.title="Connected Realms";
  }

  override getRecName(rec: connectedRealmData): string {
    return "Connected Realm "+rec.id;
  }

  override getIndexItemName(item: IIndexItem): string {
    return "Connected Realm "+item.id;
  }


  override mutateIndexItem(item: connectedRealmIndexItem): IIndexItem {
    //This index doesn't provide an ID field, so we need to extract ID from the href url
    const regex = /(?:.*)connected-realm\/(\d*)/;
    var matches = regex.exec(item.href!);
    item.id = Number.parseInt(matches![1]);
    return super.mutateIndexItem(item);
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<connectedRealmIndex>
  {
    return apiClient.getConnectedRealmsIndex() as Promise<connectedRealmIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<connectedRealmData>
  {
    return apiClient.getConnectedRealm(id) as Promise<connectedRealmData>;
  }


}