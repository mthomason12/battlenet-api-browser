import { dataStruct, linksStruct, refStruct, keyStruct, mediaDataStruct, IIndexItem, apiIndexDoc, apiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

//#region Creature Family

export interface creatureFamilyData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  name: string;
  specialization: refStruct;
  media: keyStruct;
  mediaData?: mediaDataStruct;  
}

export interface creatureFamilyIndex extends apiIndexDoc
{
}

export class creatureFamiliesDataDoc extends dbData<creatureFamilyIndex, creatureFamilyData>
{

  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "pets";      
    this.itemsName = "creature_families";
    this.type = "creature_families";
    this.title = "Creature Families";
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<creatureFamilyIndex>
  {
    return apiClient.getCreatureFamilyIndex() as Promise<creatureFamilyIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<creatureFamilyData>
  {
    return apiClient.getCreatureFamily(id) as Promise<creatureFamilyData>;
  }    

  override getAPIExtra(apiClient: apiClientService, apiRec: creatureFamilyData): Promise<void>
  {
    return new Promise((resolve)=>{
      apiClient.getCreatureFamilyMedia(apiRec.id)?.then((data: any) => {
        apiRec.mediaData = data;
        resolve();
      });
    })    
  }    

}
  
//#endregion

//#region Creature Type

export interface creatureTypeData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  name: string;
}


interface creatureTypeIndexEntry extends IIndexItem
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface creatureTypeIndex extends apiIndexDoc
{
  _links: linksStruct;
  achievements: creatureTypeIndexEntry;
}

export class creatureTypesDataDoc extends dbData<creatureTypeIndex, creatureTypeData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "cruelty_free";
    this.itemsName = "creature_types";
    this.type = "creature_types";
    this.title = "Creature Types";
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<creatureTypeIndex>
  {
    return apiClient.getCreatureTypesIndex() as Promise<creatureTypeIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<creatureTypeData>
  {
    return apiClient.getCreatureType(id) as Promise<creatureTypeData>;
  }    
  
}

//#endregion