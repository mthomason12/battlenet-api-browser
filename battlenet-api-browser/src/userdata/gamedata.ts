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
  title: string;

  constructor (parent: dataStruct, id: number, title: string)
  {
    super(parent,"Achievement: "+title);   
    this.id = id;
    this.title = title;
  }  

  override myPath(): string {
      return this.id.toString();
  }
}


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
        this.achievements = data.achievements;
        super.reload(apiclient);
      }
    );
  }

  override myPath(): string {
      return "/achievements";
  }

  override doPostProcess()
  {
    this.achievements = this.achievements.sort(function(a:any, b:any){return a.id - b.id});
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
        this.covenants = data.covenants;
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

  override name(): string
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
}