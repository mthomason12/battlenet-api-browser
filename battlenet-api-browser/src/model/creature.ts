import { dataDoc, dataStruct, dataDocCollection } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

//#region Creature Family

@Reviver<creatureFamilyDataDoc>({
  '.': Jsonizer.Self.assign(creatureFamilyDataDoc)
})
  export class creatureFamilyDataDoc extends dataDoc
  {
    id: number;
  
    constructor (parent: dataStruct, id: number, name: string)
    {
      super(parent,name);   
      this.id = id;
    }  
  
    override myPath(): string {
        return this.id.toString();
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

@Reviver<creatureTypeDataDoc>({
  '.': Jsonizer.Self.assign(creatureTypeDataDoc)
})
  export class creatureTypeDataDoc extends dataDoc
  {
    id: number;
  
    constructor (parent: dataStruct, id: number, name: string)
    {
      super(parent,name);   
      this.id = id;
    }  
  
    override myPath(): string {
        return this.id.toString();
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