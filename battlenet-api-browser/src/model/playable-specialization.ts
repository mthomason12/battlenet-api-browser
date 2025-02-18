import { dataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIPlayableSpecialization, APIPlayableSpecializationMedia, APIPlayableSpecializationsIndex } from 'battlenet-api-types';


interface playableSpecData extends APIPlayableSpecialization, IApiDataDoc {
    id: number;
    name: string;
    $media: APIPlayableSpecializationMedia;
}

interface playableSpecIndexData extends APIPlayableSpecializationsIndex, IApiIndexDoc {
}


export class playableSpecDataDoc extends dbData<playableSpecIndexData, playableSpecData> {

    constructor(parent: dataStruct, recDB: RecDB) {
        super(parent, recDB);
        this.icon = "diversity_3";
        this.itemsName = "character_specializations";
        this.type = "playable-spec";
        this.title = "Playable Specializations";
    }

    override getAPIIndex = function (apiClient: apiClientService): Promise<playableSpecIndexData> {
        return apiClient.getPlayableSpecializationIndex() as Promise<playableSpecIndexData>;
    }

    override getAPIRec = function (apiClient: apiClientService, id: number): Promise<playableSpecData> {
        return apiClient.getPlayableSpecialization(id) as Promise<playableSpecData>;
    }

    override getAPIExtra(apiClient: apiClientService, apiRec: playableSpecData): Promise<void> {
        return new Promise((resolve) => {
            Promise.allSettled([
                apiClient.getPlayableSpecializationMedia(apiRec.id)?.then((data: any) => {
                    apiRec.$media = data;
                }),
            ]).then(() => {
                resolve();
            })
        });
    }

}


//#endregion