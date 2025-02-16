import { apiClientService } from "../services/apiclient.service";
import { IApiDataDoc, IApiIndexDoc, dataStruct, idNameStruct, linksStruct, mediaStruct, refStruct } from "./datastructs";
import { dbData } from './dbdatastructs';
import { RecDB } from "../lib/recdb";
import { APIJournalEncounter, APIJournalEncountersIndex, APIJournalExpansion, APIJournalExpansionsIndex, APIJournalInstance, APIJournalInstancesIndex } from "./api/journal";

//region Journal Expansions 

export interface journalExpansionData extends APIJournalExpansion, IApiDataDoc {
  _links: linksStruct;
  id: number;
  name: string;
  dungeons: refStruct[];
}

export interface journalExpansionsIndex extends APIJournalExpansionsIndex, IApiIndexDoc {
  _links: linksStruct;
  tiers: refStruct[];
}

export class journalExpansionsDataDoc extends dbData<journalExpansionsIndex, journalExpansionData> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "sports_esports";
    this.itemsName = "tiers";
    this.type = "journal-expansions";
    this.pathName = "expansions";
    this.title = "Expansions";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<journalExpansionsIndex> {
    return apiClient.getJournalExpansionsIndex() as Promise<journalExpansionsIndex>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<journalExpansionData> {
    return apiClient.getJournalExpansion(id) as Promise<journalExpansionData>;
  }

}

//endregion

//region Journal Encounters

export interface journalEncounterData extends APIJournalEncounter, IApiDataDoc {
  id: number;
  name: string;
}

export interface journalEncountersIndex extends APIJournalEncountersIndex, IApiIndexDoc {
}

export class journalEncountersDataDoc extends dbData<journalEncountersIndex, journalEncounterData> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "sports_kabaddi";
    this.itemsName = "encounters";
    this.title = "Encounters";
    this.type = "journal-encounters";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<journalEncountersIndex> {
    return apiClient.getJournalEncountersIndex() as Promise<journalEncountersIndex>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<journalEncounterData> {
    return apiClient.getJournalEncounter(id) as Promise<journalEncounterData>;
  }

}

//endregion

//region Journal Instances

export interface journalInstanceData extends APIJournalInstance, IApiDataDoc {
  id: number;
  name: string;
}

export interface journalInstancesIndex extends APIJournalInstancesIndex, IApiIndexDoc {
}

export class journalInstancesDataDoc extends dbData<journalInstancesIndex, journalInstanceData> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "door_front";
    this.type = "journal-instances";
    this.itemsName = "instances";
    this.title = "Instances";
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<journalInstancesIndex> {
    return apiClient.getJournalInstancesIndex() as Promise<journalInstancesIndex>;
  }

  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<journalInstanceData> {
    return apiClient.getJournalInstance(id) as Promise<journalInstanceData>;
  }

}


//endregion