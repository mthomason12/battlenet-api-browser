import { dataDoc, dataStruct, dataDocCollection } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

@Reviver<covenantDataDoc>({
    '.': Jsonizer.Self.assign(covenantDataDoc)
  })
  export class covenantDataDoc extends dataDoc
  {
    id: number;
    title: string;
  
    constructor (parent: dataStruct, id: number, title: string)
    {
      super(parent,"Covenant: "+title);   
      this.id = id;
      this.title = title;
    }  
  
    override myPath(): string {
        return this.id.toString();
    }
  }
  
  
  @Reviver<covenantsDataDoc>({
    '.': Jsonizer.Self.assign(covenantsDataDoc),
    items: {
      '*': covenantDataDoc
    }
  })
  export class covenantsDataDoc extends dataDocCollection<covenantDataDoc>
  {
    constructor (parent: dataStruct)
    {
      super(parent,"Covenants");   
    }
  
    override async reload(apiclient: ApiclientService)
    {
      await apiclient.getCovenantIndex()?.then (
        (data: any) => {
          var json: string = JSON.stringify(data.covenants);
          const reviver = Reviver.get(covenantsDataDoc)
          const covReviver = reviver['items'] as Reviver<covenantDataDoc[]>;
          this.items = JSON.parse(json, covReviver);
          this.postFixup();
          super.reload(apiclient);
        }
      );
    }
  
    override myPath(): string {
        return "covenants";
    }

  }