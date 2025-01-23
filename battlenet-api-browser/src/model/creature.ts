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
    id: number;
    data?: creatureFamilyData;
    media?: creatureFamilyMedia;
  
    constructor (parent: dataStruct, id: number, name: string)
    {
      super(parent,name);   
      this.id = id;
    }  
  
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
    }
  
    override async reload(apiclient: ApiclientService)
    {
      await apiclient.getCreatureFamilyIndex()?.then (
        (data: any) => {
          var json: string = JSON.stringify(data.creature_families);
          const reviver = Reviver.get(creatureFamiliesDataDoc);;
          const covReviver = reviver['items'] as Reviver<creatureFamilyDataDoc[]>;
          this.items = JSON.parse(json, covReviver);
          this.postFixup();
          super.reload(apiclient);
        }
      );
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
    id: number;
    data?: creatureTypeData;   
  
    constructor (parent: dataStruct, id: number, name: string)
    {
      super(parent,name);   
      this.id = id;
    }  
  
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
    }
  
    override async reload(apiclient: ApiclientService)
    {
      await apiclient.getCreatureTypesIndex()?.then (
        (data: any) => {
          var json: string = JSON.stringify(data.creature_types);
          const reviver = Reviver.get(creatureTypesDataDoc);
          console.dir(reviver);
          const covReviver = reviver['items'] as Reviver<creatureTypeDataDoc[]>;
          console.dir(covReviver);
          this.items = JSON.parse(json, covReviver);
          console.dir(this.items);
          this.postFixup();
          super.reload(apiclient);
        }
      );
    }
  
    override myPath(): string {
        return "creature-types";
    }

  }

  //#endregion