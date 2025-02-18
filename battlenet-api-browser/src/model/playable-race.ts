import { dataStruct, IApiIndexDoc, IApiDataDoc } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';
import { APIPlayableRace, APIPlayableRacesIndex } from 'battlenet-api-types';


export interface playableRaceData extends APIPlayableRace, IApiDataDoc {
    id: number;
    name: string;
}

interface playableRaceIndexData extends APIPlayableRacesIndex, IApiIndexDoc {
}


export class playableRaceDataDoc extends dbData<playableRaceIndexData, playableRaceData> {

    constructor(parent: dataStruct, recDB: RecDB) {
        super(parent, recDB);
        this.icon = "diversity_3";
        this.itemsName = "races";
        this.type = "playable-race";
        this.title = "Playable Races";
    }

    override getAPIIndex = function (apiClient: apiClientService): Promise<playableRaceIndexData> {
        return apiClient.getPlayableRaceIndex() as Promise<playableRaceIndexData>;
    }

    override getAPIRec = function (apiClient: apiClientService, id: number): Promise<playableRaceData> {
        return apiClient.getPlayableRace(id) as Promise<playableRaceData>;
    }

}


//#endregion