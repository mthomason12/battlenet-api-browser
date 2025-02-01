import { Jsonizer, Reviver } from "@badcafe/jsonizer";
import { ApiclientService } from "../services/apiclient.service";
import { dataDetailDoc, dataDoc, dataDocDetailsCollection, dataStruct, keyStruct, linksStruct, mediaDataStruct, mediaStruct, refStruct } from "./datastructs";

//region Journal Expansions 

export interface journalExpansionData
{
    _links?: linksStruct;
    dungeons: refStruct[];
}


@Reviver<journalExpansionDataDetailDoc>({
  '.': Jsonizer.Self.endorse(journalExpansionDataDetailDoc)
})
export class journalExpansionDataDetailDoc extends dataDetailDoc
{
  _links?: linksStruct;
  dungeons?: refStruct[];
}

@Reviver<journalExpansionDataDoc>({
  '.': Jsonizer.Self.endorse(journalExpansionDataDoc)
})
export class journalExpansionDataDoc extends dataDoc
{
  key?: keyStruct;
}


export interface journalExpansionsIndex {
    _links: linksStruct;
    tiers: refStruct[];
}

@Reviver<journalExpansionsDataDoc>({
  '.': Jsonizer.Self.assign(journalExpansionsDataDoc),
  items: {
    '*': journalExpansionDataDoc
  },
  details: {
    '*': journalExpansionDataDetailDoc
  }
})
export class journalExpansionsDataDoc extends dataDocDetailsCollection<journalExpansionDataDoc, journalExpansionDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Expansions");
    this.icon = "sports_esports";
    this.dbkey = "wow-g-expansions";
    this.thisType = journalExpansionsDataDoc;
    this.detailsType = journalExpansionDataDetailDoc;
    this.itemsName = "tiers";
}

  override getItems = function(apiClient: ApiclientService): Promise<journalExpansionsIndex>
  {
    return apiClient.getJournalExpansionsIndex() as Promise<journalExpansionsIndex>;
  }

  override getDetails? = function(apiClient: ApiclientService, id: number): Promise<journalExpansionData>
  {
    return apiClient.getJournalExpansion(id) as Promise<journalExpansionData>;
  }

  override myPath(): string {
    return "expansions";
  }  
}

//endregion

//region Journal Encounters

//endregion

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

export interface journalEncounterData
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

@Reviver<journalEncounterDataDetailDoc>({
  '.': Jsonizer.Self.endorse(journalEncounterDataDetailDoc)
})
export class journalEncounterDataDetailDoc extends dataDetailDoc
{
  _links?: linksStruct;
  encounters?: refStruct[];
}

@Reviver<journalEncounterDataDoc>({
  '.': Jsonizer.Self.endorse(journalEncounterDataDoc)
})
export class journalEncounterDataDoc extends dataDoc
{
  key?: keyStruct;
}


export interface journalEncountersIndex {
    _links: linksStruct;
    encounters: refStruct[];
}

@Reviver<journalEncountersDataDoc>({
  '.': Jsonizer.Self.assign(journalEncountersDataDoc),
  items: {
    '*': journalEncounterDataDoc
  },
  details: {
    '*': journalEncounterDataDetailDoc
  }
})
export class journalEncountersDataDoc extends dataDocDetailsCollection<journalEncounterDataDoc, journalEncounterDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent, "Encounters");
    this.icon = "sports_kabaddi";
    this.dbkey = "wow-g-encounters";
    this.thisType = journalEncountersDataDoc;
    this.detailsType = journalEncounterDataDetailDoc;
    this.itemsName = "encounters";
}

  override getItems = function(apiClient: ApiclientService): Promise<journalEncountersIndex>
  {
    return apiClient.getJournalEncountersIndex() as Promise<journalEncountersIndex>;
  }

  override getDetails? = function(apiClient: ApiclientService, id: number): Promise<journalEncounterData>
  {
    return apiClient.getJournalEncounter(id) as Promise<journalEncounterData>;
  }

}