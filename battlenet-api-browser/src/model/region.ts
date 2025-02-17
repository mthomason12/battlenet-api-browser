import { dataStruct, linksStruct, hrefStruct, refStruct, IApiIndexDoc, IApiDataDoc, IIndexItem } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIRegion, APIRegionsIndex } from './api/gamedata/region';

export interface regionData extends APIRegion, IApiDataDoc {
    id: number;
    name: string;
}


export interface regionIndex extends APIRegionsIndex, IApiIndexDoc {
}

export class regionsDataDoc extends dbData<regionIndex, regionData> 
{
  constructor (parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "south_america";
    this.itemsName = "regions";
    this.type="region";
    this.title="Regions";
  }

  override getRecName(rec: regionData): string {
    return "Region "+rec.id;
  }

  override getIndexItemName(item: IIndexItem): string {
    return "Region "+item.id;
  }


  override mutateIndexItem(item: IIndexItem): IIndexItem {
    const itm = item as hrefStruct;
    //This index doesn't provide an ID field, so we need to extract ID from the href url
    const regex = /(?:.*)region\/(\d*)/;
    var matches = regex.exec(itm.href!);
    item.id = Number.parseInt(matches![1]);
    return super.mutateIndexItem(itm as IIndexItem);
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<regionIndex> {
    return apiClient.getRegionIndex() as Promise<regionIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<regionData>
{
    return apiClient.getRegion(id) as Promise<regionData>;
  }


}