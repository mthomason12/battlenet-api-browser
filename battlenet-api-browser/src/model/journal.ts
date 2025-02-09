import { apiClientService } from "../services/apiclient.service";
import { IApiDataDoc, IApiIndexDoc, dataStruct, idNameStruct, linksStruct, mediaStruct, refStruct } from "./datastructs";
import { dbData } from './dbdatastructs';
import { RecDB } from "../lib/recdb";

//region Journal Expansions 

export interface journalExpansionData extends IApiDataDoc
{
    _links?: linksStruct;
    dungeons: refStruct[];
}

export interface journalExpansionsIndex extends IApiIndexDoc
{
    _links: linksStruct;
    tiers: refStruct[];
}

export class journalExpansionsDataDoc extends dbData<journalExpansionsIndex, journalExpansionData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "sports_esports";
    this.itemsName = "tiers";
    this.type = "journal-expansions";
    this.title = "Expansions";
}

override getAPIIndex = function(apiClient: apiClientService): Promise<journalExpansionsIndex>
{
  return apiClient.getJournalExpansionsIndex() as Promise<journalExpansionsIndex>;
}

override getAPIRec = function(apiClient: apiClientService, id: number): Promise<journalExpansionData>
{
  return apiClient.getJournalExpansion(id) as Promise<journalExpansionData>;
}

  override myPath(): string {
    return "expansions";
  }  
}

//endregion

//region Journal Encounters

interface journalEncounterCreature {
  id?: number;
  name?: string;
  creature_display?: mediaStruct;
}

interface journalEncounterItem {
  id?: number;
  item?: refStruct;
}

interface journalEncounterSection {
  id?: number;
  title?: string;
  body_text?: string;
  sections?: journalEncounterSection[];
  creature_display?: mediaStruct;
}

interface journalEncounterMode {
  type?: string;
  name?: string;
}

export interface journalEncounterData extends IApiDataDoc
{
    _links?: linksStruct;
    description?: string;
    creatures: journalEncounterCreature[];
    items: journalEncounterItem[];
    sections: journalEncounterSection[];
    instance: refStruct;
    category: {
      type: string;
    };
    modes: journalEncounterMode[]
}

export interface journalEncountersIndex extends IApiIndexDoc {
    _links: linksStruct;
    encounters: refStruct[];
}

export class journalEncountersDataDoc extends dbData<journalEncountersIndex, journalEncounterData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "sports_kabaddi";
    this.itemsName = "encounters";
    this.title = "Encounters";
    this.type = "journal-encounters";
}

override getAPIIndex = function(apiClient: apiClientService): Promise<journalEncountersIndex>
{
  return apiClient.getJournalEncountersIndex() as Promise<journalEncountersIndex>;
}

override getAPIRec = function(apiClient: apiClientService, id: number): Promise<journalEncounterData>
{
  return apiClient.getJournalEncounter(id) as Promise<journalEncounterData>;
}

}

//endregion

//region Journal Instances

export interface journalInstanceData extends IApiDataDoc
{
    _links?: linksStruct;
    name: string;
    map?: idNameStruct;
    area?: idNameStruct;
    description?: string;
    encounters?: refStruct[];
    media?: mediaStruct;
    minimum_level: number;
    category: {
      type: string;
    }
    order_index: number;
}

export interface journalInstancesIndex extends IApiIndexDoc {
    _links: linksStruct;
    Instances: refStruct[];
}

export class journalInstancesDataDoc extends dbData<journalInstancesIndex, journalInstanceData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "door_front";
    this.type = "journal-instances";
    this.itemsName = "instances";
    this.title = "Instances";
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<journalInstancesIndex>
  {
    return apiClient.getJournalInstancesIndex() as Promise<journalInstancesIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<journalInstanceData>
  {
    return apiClient.getJournalInstance(id) as Promise<journalInstanceData>;
  }

}


//endregion