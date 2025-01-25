import { dataDoc, dataStruct, dataDocCollection, linksStruct, assetStruct, dataDetailDoc, refStruct, dataDocDetailsCollection, keyStruct, mediaDataStruct } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

//#region Creature Family


interface creatureFamilyData
{
  _links: linksStruct;
  id: number;
  name: string;
  specialization: refStruct;
  media: keyStruct;
}

  @Reviver<creatureFamilyDetailsDoc>({
    '.': Jsonizer.Self.endorse(creatureFamilyDetailsDoc)
  })
  export class creatureFamilyDetailsDoc extends dataDetailDoc
  {
    _links?: linksStruct;
    specialization?: refStruct;
    mediaData?: mediaDataStruct;

    override async getExtraDetails(apiClient: ApiclientService): Promise<void> 
    {
      await apiClient.getCreatureFamilyMedia(this.id)?.then(
        (data: any) => {
          this.mediaData = data;
        });
    }
  }

  @Reviver<creatureFamilyDataDoc>({
    '.': Jsonizer.Self.endorse(creatureFamilyDataDoc)
  })
  export class creatureFamilyDataDoc extends dataDoc
  {
  }

  
  @Reviver<creatureFamiliesDataDoc>({
    '.': Jsonizer.Self.assign(creatureFamiliesDataDoc),
    items: {
      '*': creatureFamilyDataDoc
    },
    details:{
      '*': creatureFamilyDetailsDoc
    }
  })
  export class creatureFamiliesDataDoc extends dataDocDetailsCollection<creatureFamilyDataDoc, creatureFamilyDetailsDoc>
  {
    constructor (parent: dataStruct)
    {
      super(parent,"Creature Families");
      this.dbkey = "wow-p-creature_families";
      this.icon = "pets";      
      this.thisType = creatureFamiliesDataDoc;
      this.detailsType = creatureFamilyDetailsDoc;
      this.itemsName = "creature_families";
    }
  
    override getItems = function(apiClient: ApiclientService): Promise<any>
    {
      return apiClient.getCreatureFamilyIndex() as Promise<any>;
    }
    
    override getDetails? = function(apiClient: ApiclientService, id: number): Promise<creatureFamilyData>
    {
      return apiClient.getCreatureFamily(id) as Promise<creatureFamilyData>;
    }
  }
  

//#endregion

//#region Creature Type

  export interface creatureTypeData
  {
    _links: linksStruct;
    id: number;
    name: string;
  }

  
  interface creatureTypeIndexEntry
  {
    key: keyStruct;
    name: string;
    id: number;
  }

  export interface creatureTypeIndex
  {
    _links: linksStruct;
    achievements: creatureTypeIndexEntry;
  }

  @Reviver<creatureTypeDetailsDoc>({
    '.': Jsonizer.Self.endorse(creatureTypeDetailsDoc)
  })
  export class creatureTypeDetailsDoc extends dataDetailDoc
  {
    _links?: linksStruct;
  }

  @Reviver<creatureTypeDataDoc>({
    '.': Jsonizer.Self.endorse(creatureFamilyDataDoc)
  })
  export class creatureTypeDataDoc extends dataDoc
  {
  }


  @Reviver<creatureTypesDataDoc>({
    '.': Jsonizer.Self.assign(creatureTypesDataDoc),
    items: {
      '*': creatureTypeDataDoc
    },
    details: {
      '*': creatureTypeDetailsDoc
    }
  })
  export class creatureTypesDataDoc extends dataDocDetailsCollection<creatureTypeDataDoc, creatureTypeDetailsDoc>
  {
    constructor (parent: dataStruct)
    {
      super(parent,"Creature Types");
      this.dbkey = "wow-p-creature_types";
      this.icon = "cruelty_free";
      this.thisType = creatureTypesDataDoc;
      this.detailsType = creatureTypeDetailsDoc;
      this.itemsName = "creature_types";
    }
    
    override getItems = function(apiClient: ApiclientService): Promise<creatureTypeIndex>
    {
      return apiClient.getCreatureTypesIndex() as Promise<any>;
    }

    override getDetails = function(apiClient: ApiclientService, id: number): Promise<creatureTypeData>
    {
      return apiClient.getCreatureType(id)as Promise<creatureTypeData>
    }
    

  }

  //#endregion