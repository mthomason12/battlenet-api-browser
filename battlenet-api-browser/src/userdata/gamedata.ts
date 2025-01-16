import { dataDoc, dataStruct } from './datastructs';
import type { dataItem } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';

interface achievement extends dataItem
{
}

interface covenant extends dataItem
{
}


export class achievementsDataDoc extends dataDoc
{
  achievements: achievement[] = new Array();

  constructor (parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath, "Achievements");
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getAchievementIndex()?.then (
      (data: any) => {
        this.achievements = data;
        super.reload(apiclient);
      }
    );
  }

  override postProcess()
  {
    console.log("PostProcessing");
    this.achievements = this.achievements.sort(function(a:any, b:any){return a.id - b.id});
  }
}

export class covenantsDataDoc extends dataDoc
{
  covenants: covenant[] = new Array();

  constructor (parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath,"Covenants");   
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getCovenantIndex()?.then (
      (data: any) => {
        this.covenants = data;
        super.reload(apiclient);
      }
    );
  }

  override postProcess()
  {
    console.log("PostProcessing");
    this.covenants = this.covenants.sort(function(a:any, b:any){return a.id - b.id});
  }
}

export class publicDataStruct extends dataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;

  constructor(parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath);
    this.achievementData = new achievementsDataDoc(this._path, "achievements");
    this.covenantData = new covenantsDataDoc(this._path, "covenants");
  }

  override name(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.achievementData, this.covenantData]);
  } 
}