import { dataDoc, dataStruct, dataDocCollection, linksStruct, assetStruct, keyStruct, refStruct } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

//#region Creature Family

interface creatureFamilyMedia
{
  _links: linksStruct;
  assets: assetStruct;
  id: number;
}

interface creatureFamilyData
{
  _links: linksStruct;
  id: number;
  name: string;
  specialization: refStruct;
}

@Reviver<creatureFamilyDataDoc>({
  '.': Jsonizer.Self.assign(creatureFamilyDataDoc)
})
  export class creatureFamilyDataDoc extends dataDoc
  {
    data?: creatureFamilyData;
    media?: creatureFamilyMedia;

    override myPath(): string {
        return this.id.toString();
    }

    override async reload(apiclient: ApiclientService)
    {
      await apiclient.getCreatureFamily(this.id)?.then (
        async (data: any) => {
          this.data = data;
          await apiclient.getCreatureFamilyMedia(this.id)?.then(
            (data: any) => {
              this.media = data;
              this.postFixup();
              super.reload(apiclient);
            }
          )
        }
      );
    }

  }

  
  
  @Reviver<creatureFamiliesDataDoc>({
    '.': Jsonizer.Self.assign(creatureFamiliesDataDoc),
    items: {
      '*': creatureFamilyDataDoc
    }
  })
  export class creatureFamiliesDataDoc extends dataDocCollection<creatureFamilyDataDoc>
  {
    constructor (parent: dataStruct)
    {
      super(parent,"Creature Families");
      this.dbkey = "wow-p-creature_families";
      this.icon = "pets";      
      this.thisType = creatureFamiliesDataDoc;
      this.itemsName = "creature_families";
    }
  
    override getItems = function(apiClient: ApiclientService): Promise<any>
    {
      return apiClient.getCreatureFamilyIndex() as Promise<any>;
    }
    
    override myPath(): string {
        return "creature-families";
    }
  }
  

//#endregion

//#region Creature Type

interface creatureTypeData
{
  _links: linksStruct;
  id: number;
  name: string;
}

@Reviver<creatureTypeDataDoc>({
  '.': Jsonizer.Self.assign(creatureTypeDataDoc)
})
  export class creatureTypeDataDoc extends dataDoc
  {
    data?: creatureTypeData;   
   
    override myPath(): string {
        return this.id.toString();
    }

    override async reload(apiclient: ApiclientService)
    {
      await apiclient.getCreatureType(this.id)?.then (
        async (data: any) => {
          this.data = data;
          this.postFixup();
          super.reload(apiclient);
        }
      );
    }

  }


  @Reviver<creatureTypesDataDoc>({
    '.': Jsonizer.Self.assign(creatureTypesDataDoc),
    items: {
      '*': creatureTypeDataDoc
    }
  })
  export class creatureTypesDataDoc extends dataDocCollection<creatureTypeDataDoc>
  {
    constructor (parent: dataStruct)
    {
      super(parent,"Creature Types");
      this.dbkey = "wow-p-creature_types";
      this.icon = "cruelty_free";
      this.thisType = creatureTypesDataDoc;
      this.itemsName = "creature_types";
    }
    
    override getItems = function(apiClient: ApiclientService): Promise<any>
    {
      return apiClient.getCreatureTypesIndex() as Promise<any>;
    }
    
    override myPath(): string {
        return "creature-type";
    }
  }

  //#endregion