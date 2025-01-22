import { dataDoc, dataStruct, dataDocCollection, keyStruct, linksStruct, mediaStruct, assetStruct } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

interface achievementCategory
{
  key: keyStruct;
  name: string;
  id: number;
}

interface achievementCriteria
{
  id: number;
  description: string;
  amount: number;
}

interface achievementNextAchievement
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface achievementData
{
  _links: linksStruct;
  id: number;
  category: achievementCategory;
  name: string;
  description: string;
  points: number;
  is_account_wide: string;
  criteria: achievementCriteria;
  next_achievement: achievementNextAchievement;
  media: mediaStruct;
  display_order: number;
}

interface achievementMedia
{
  _links: linksStruct;
  assets: assetStruct[];
  id: number;
}

interface achievementIndexEntry
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface achievementsIndex
{
  _links: linksStruct;
  achievements: achievementIndexEntry;
}

@Reviver<achievementDataDoc>({
  '.': Jsonizer.Self.assign(achievementDataDoc)
})
export class achievementDataDoc extends dataDoc
{
  id: number;
  data?: achievementData;
  media?: achievementMedia;

  constructor (parent: dataStruct, id: number, name: string)
  {
    super(parent, name);   
    this.id = id;
  }  

  override myPath(): string {
      return this.id.toString();
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getAchievement(this.id)?.then (
      async (data: any) => {
        this.data = data;
        await apiclient.getAchievementMedia(this.id)?.then(
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

@Reviver<achievementsDataDoc>({
  '.': Jsonizer.Self.assign(achievementsDataDoc),
  items: {
    '*': achievementDataDoc
  }
})
export class achievementsDataDoc extends dataDocCollection<achievementDataDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Achievements");
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getAchievementIndex()?.then (
      (data: achievementsIndex) => {
        var json: string = JSON.stringify(data.achievements);
        const reviver = Reviver.get(achievementsDataDoc)
        const achReviver = reviver['items'] as Reviver<achievementDataDoc[]>;
        this.items = JSON.parse(json, achReviver);
        this.postFixup();
        super.reload(apiclient);
      }
    );
  }

  override myPath(): string {
      return "achievements";
  }
}