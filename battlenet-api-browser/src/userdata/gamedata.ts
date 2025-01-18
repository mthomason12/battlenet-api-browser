import { dataDoc, dataStruct } from './datastructs';
import type { dataItem } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

@Reviver<achievementDataDoc>({
  '.': Jsonizer.Self.assign(achievementDataDoc)
})
class achievementDataDoc extends dataDoc
{
  id: number;

  constructor (parent: dataStruct, id: number, name: string)
  {
    super(parent, name);   
    this.id = id;
  }  

  override myPath(): string {
      return this.id.toString();
  }
}

@Reviver<achievementsDataDoc>({
  '.': Jsonizer.Self.assign(achievementsDataDoc),
  achievements: {
    '*': achievementDataDoc
  }
})
export class achievementsDataDoc extends dataDoc
{
  achievements: achievementDataDoc[] = new Array();

  constructor (parent: dataStruct)
  {
    super(parent, "Achievements");
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getAchievementIndex()?.then (
      (data: any) => {
        var json: string = JSON.stringify(data.achievements);
        const reviver = Reviver.get(achievementsDataDoc)
        const achReciver = reviver['achievements'] as Reviver<achievementDataDoc[]>;
        this.achievements = JSON.parse(json, achReciver);
        this.postFixup();
        super.reload(apiclient);
      }
    );
  }

  override myPath(): string {
      return "achievements";
  }

  override doPostProcess()
  {
    this.achievements = this.achievements.sort(function(a:any, b:any){return a.id - b.id});
  }

  override postFixup(): void {
    this.achievements.forEach((achievements)=>{achievements.fixup(this)});
  }
}

@Reviver<covenantDataDoc>({
  '.': Jsonizer.Self.assign(covenantDataDoc)
})
class covenantDataDoc extends dataDoc
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

@Reviver<publicDataStruct>({
  '.': Jsonizer.Self.assign(publicDataStruct),
  achievementData: achievementsDataDoc,
  covenantData: covenantsDataDoc
})
export class publicDataStruct extends dataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.achievementData = new achievementsDataDoc(this);
    this.covenantData = new covenantsDataDoc(this);
  }

  override getName(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.achievementData, this.covenantData]);
  } 

  override myPath(): string {
      return "public";
  }

  override postFixup(): void {
    this.achievementData.fixup(this);
    this.covenantData.fixup(this);
  }
}