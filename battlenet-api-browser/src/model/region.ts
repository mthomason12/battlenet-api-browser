import { dataStruct, linksStruct, hrefStruct, refStruct, apiIndexDoc, apiDataDoc, IIndexItem } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

export interface regionData extends apiDataDoc {
    _links?: linksStruct;
    id: number;
    name: string;
    tag?: string;
    patch_string?: string;
}

interface regionIndexItem extends IIndexItem, hrefStruct
{ }

export interface regionIndex extends apiIndexDoc {
  _links: linksStruct;
  regions: regionIndexItem[];
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


  override mutateIndexItem(item: regionIndexItem): IIndexItem {
    //This index doesn't provide an ID field, so we need to extract ID from the href url
    const regex = /(?:.*)region\/(\d*)/;
    var matches = regex.exec(item.href!);
    item.id = Number.parseInt(matches![1]);
    return super.mutateIndexItem(item);
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<regionIndex> {
    return apiClient.getRegionIndex() as Promise<regionIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<regionData>
{
    return apiClient.getRegion(id) as Promise<regionData>;
  }


}