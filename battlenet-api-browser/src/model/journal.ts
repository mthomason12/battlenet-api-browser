//region Journal Expansions 

import { Jsonizer, Reviver } from "@badcafe/jsonizer";
import { ApiclientService } from "../services/apiclient.service";
import { dataDetailDoc, dataDoc, dataDocDetailsCollection, dataStruct, keyStruct, linksStruct, refStruct } from "./datastructs";

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
    '*': journalExpansionsDataDoc
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

//region