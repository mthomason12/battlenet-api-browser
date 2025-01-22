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
    title: string;
  
    constructor (parent: dataStruct, id: number, title: string)
    {
      super(parent,"Creature Family: "+title);   
      this.id = id;
      this.title = title;
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
          const reviver = Reviver.get(creatureFamilyDataDoc)
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
    title: string;
  
    constructor (parent: dataStruct, id: number, title: string)
    {
      super(parent,"Creature Type: "+title);   
      this.id = id;
      this.title = title;
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
          const reviver = Reviver.get(creatureTypeDataDoc)
          const covReviver = reviver['items'] as Reviver<creatureTypeDataDoc[]>;
          this.items = JSON.parse(json, covReviver);
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