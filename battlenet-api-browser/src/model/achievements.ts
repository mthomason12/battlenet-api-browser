import { dataDoc, dataStruct, keyStruct, linksStruct, mediaStruct, dataDetailDoc, dataDocDetailsCollection, mediaDataStruct, refStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

interface achievementCategory
{
  key: keyStruct;
  name: string;
  id: number;
}

interface achievementOperator {
  type: string; //known values: AND, COMPLETE_AT_LEAST
  name: string; 
}

interface achievementChildCriteria
{
  id: number;
  description?: string;
  amount?: number;
  achievement?: refStruct;
  
}

interface achievementCriteria
{
  id: number;
  description?: string;
  amount?: number;
  operator?: achievementOperator;
  child_criteria?: achievementChildCriteria[];
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

@Reviver<achievementDataDetailDoc>({
  '.': Jsonizer.Self.endorse(achievementDataDetailDoc)
})
export class achievementDataDetailDoc extends dataDetailDoc
{
  _links?: linksStruct;
  category?: achievementCategory;
  description?: string;
  points?: number;
  is_account_wide?: string;
  criteria?: achievementCriteria;
  next_achievement?: achievementNextAchievement;
  media?: mediaStruct;
  display_order?: number;
  mediaData?: mediaDataStruct;

  override async getExtraDetails(apiClient: ApiclientService): Promise<void> 
  {
    await apiClient.getAchievementMedia(this.id)?.then(
      (data: any) => {
        this.mediaData = data;
      });
  }
}

@Reviver<achievementDataDoc>({
  '.': Jsonizer.Self.endorse(achievementDataDoc)
})
export class achievementDataDoc extends dataDoc
{
  key?: keyStruct;
}

@Reviver<achievementsDataDoc>({
  '.': Jsonizer.Self.assign(achievementsDataDoc),
  items: {
    '*': achievementDataDoc
  },
  details: {
    '*': achievementDataDetailDoc
  }
})
export class achievementsDataDoc extends dataDocDetailsCollection<achievementDataDoc, achievementDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Achievements");
    this.icon = "emoji_events";
    this.dbkey = "wow-g-achievements";
    this.thisType = achievementsDataDoc;
    this.detailsType = achievementDataDetailDoc;
    this.itemsName = "achievements";
}

  override getItems = function(apiClient: ApiclientService): Promise<achievementsIndex>
  {
    return apiClient.getAchievementIndex() as Promise<achievementsIndex>;
  }

  override getDetails? = function(apiClient: ApiclientService, id: number): Promise<achievementData>
  {
    return apiClient.getAchievement(id) as Promise<achievementData>;
  }
}