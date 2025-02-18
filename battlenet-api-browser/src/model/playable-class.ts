import { dataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIPlayableClass, APIPlayableClassesIndex, APIPlayableClassMedia, APIPvPTalentSlots } from 'battlenet-api-types';


interface playableClassData extends APIPlayableClass, IApiDataDoc {
  id: number;
  name: string;
  $media: APIPlayableClassMedia;
  $pvpTalentSlots: APIPvPTalentSlots;
}

interface playableClassIndexData extends APIPlayableClassesIndex, IApiIndexDoc {
}


export class playableClassDataDoc extends dbData<playableClassIndexData, playableClassData> {

  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "diversity_3";
    this.itemsName = "classes";
    this.type = "playable-class";
    this.title = "Playable Classes";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<playableClassIndexData> {
    return apiClient.getPlayableClassIndex() as Promise<playableClassIndexData>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<playableClassData> {
    return apiClient.getPlayableClass(id) as Promise<playableClassData>;
  }

  override getAPIExtra(apiClient: apiClientService, apiRec: playableClassData): Promise<void> {
    return new Promise((resolve) => {
      Promise.allSettled([
        apiClient.getPlayableClassMedia(apiRec.id)?.then((data: any) => {
          apiRec.$media = data;
        }),
        apiClient.getPlayableClassPVPTalentSlots(apiRec.id)?.then((data: any) => {
          apiRec.$pvpTalentSlots = data;
        })
      ]).then(() => {
        resolve();
      })
    });
  }

}


//#endregion