import { dataStruct, mediaDataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APICreatureFamiliesIndex, APICreatureFamily, APICreatureType, APICreatureTypesIndex } from 'battlenet-api-types';

//#region Creature Family

export interface creatureFamilyData extends APICreatureFamily, IApiDataDoc
{
  id: number;
  name: string;
  $mediaData?: mediaDataStruct;  
}

export interface creatureFamilyIndex extends APICreatureFamiliesIndex, IApiIndexDoc
{
}

export class creatureFamiliesDataDoc extends dbData<creatureFamilyIndex, creatureFamilyData>
{

  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "pets";      
    this.itemsName = "creature_families";
    this.type = "creature-families";
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
        apiRec.$mediaData = data;
        resolve();
      });
    })    
  }    

}
  
//#endregion

//#region Creature Type

export interface creatureTypeData extends APICreatureType, IApiDataDoc
{
  id: number;
  name: string;
}

export interface creatureTypeIndex extends APICreatureTypesIndex, IApiIndexDoc {
}

export class creatureTypesDataDoc extends dbData<creatureTypeIndex, creatureTypeData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "cruelty_free";
    this.itemsName = "creature_types";
    this.type = "creature-types";
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