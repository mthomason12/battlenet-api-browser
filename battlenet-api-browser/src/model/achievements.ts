import { dataDoc, dataStruct } from './datastructs';
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