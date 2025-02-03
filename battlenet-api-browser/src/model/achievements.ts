import { dataStruct, keyStruct, linksStruct, mediaStruct, dataDetailDoc, mediaDataStruct, refStruct, dbData, apiIndexDoc, apiDataDoc } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

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

export interface achievementData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  category?: achievementCategory;
  name: string;
  description?: string;
  points?: number;
  is_account_wide?: string;
  criteria?: achievementCriteria;
  next_achievement?: achievementNextAchievement;
  media?: mediaStruct;
  display_order?: number;
  mediaData?: mediaDataStruct;
}

interface achievementIndexEntry
{
  key: keyStruct;
  name: string;
  id: number;
}

export interface achievementsIndex extends apiIndexDoc
{
  _links: linksStruct;
  achievements: achievementIndexEntry;
}

export class achievementsDataDoc extends dbData<achievementsIndex, achievementData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "emoji_events";
    this.itemsName = "achievements";
    this.type = "achievements";
    this.title = "Achievements"; 
}

  override getAPIIndex = function(apiClient: ApiclientService): Promise<achievementsIndex>
  {
    return apiClient.getAchievementIndex() as Promise<achievementsIndex>;
  }

  override getAPIRec = function(apiClient: ApiclientService, id: number): Promise<achievementData>
  {
    return apiClient.getAchievement(id) as Promise<achievementData>;
  }

  override getAPIExtra(apiClient: ApiclientService, apiRec: achievementData): Promise<void> 
  {
    return new Promise((resolve)=>{
      apiClient.getAchievementMedia(apiRec.id)?.then(
        (data: any) => {
          apiRec.mediaData = data;
          resolve();
        });
    })

  }    

}