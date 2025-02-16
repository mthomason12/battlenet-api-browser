import { dataStruct, mediaDataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIAchievement, APIAchievementsIndex } from './api/achievements';

export interface achievementData extends APIAchievement, IApiDataDoc
{
  id: number;
  name: string;
  $mediaData?: mediaDataStruct;
}

export interface achievementsIndex extends APIAchievementsIndex, IApiIndexDoc {
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

  override getAPIIndex = function(apiClient: apiClientService): Promise<achievementsIndex>
  {
    return apiClient.getAchievementIndex() as Promise<achievementsIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<achievementData>
  {
    return apiClient.getAchievement(id) as Promise<achievementData>;
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: achievementData): Promise<void> 
  {
    return new Promise((resolve)=>{
      apiClient.getAchievementMedia(apiRec.id)?.then(
        (data: any) => {
          apiRec.$mediaData = data;
          resolve();
        });
    })

  }    

}