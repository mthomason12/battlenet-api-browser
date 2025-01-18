import { dataDoc, dataStruct } from './datastructs';
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
    covenants: {
      '*': covenantDataDoc
    }
  })
  export class covenantsDataDoc extends dataDoc
  {
    covenants: covenantDataDoc[] = new Array();
  
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
          const covReciver = reviver['covenants'] as Reviver<covenantDataDoc[]>;
          this.covenants = JSON.parse(json, covReciver);
          this.postFixup();
          super.reload(apiclient);
        }
      );
    }
  
    override doPostProcess()
    {
      this.covenants = this.covenants.sort(function(a:any, b:any){return a.id - b.id});    
    }
  
    override myPath(): string {
        return "covenants";
    }
  
    override postFixup(): void {
      this.covenants.forEach((covenant)=>{covenant.fixup(this)});
    }
  }