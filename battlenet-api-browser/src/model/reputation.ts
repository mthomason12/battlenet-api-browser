import { dataStruct, linksStruct, hrefStruct, refStruct, IApiIndexDoc, IApiDataDoc, IIndexItem, factionStruct } from './datastructs';
import { dbData } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

export interface ReputationFactionData extends IApiDataDoc {
    _links?: linksStruct;
    id: number;
    name: string;
    description: string;
    reputation_tiers: {
        key: hrefStruct;
        name?: string;
        id: number;
    }
    player_faction?: factionStruct;
}

interface ReputationFactionIndexItem extends refStruct
{ }

export interface ReputationFactionIndex extends IApiIndexDoc {
  _links: linksStruct;
  factions: ReputationFactionIndexItem[];
}

export class reputationFactionDataDoc extends dbData<ReputationFactionIndex, ReputationFactionData> 
{
  constructor (parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "score";
    this.itemsName = "factions";
    this.type="reputation-faction";
    this.title="Reputation Factions";
    this.pathName = "reputation-factions";
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<ReputationFactionIndex> {
    return apiClient.getReputationFactionIndex() as Promise<ReputationFactionIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<ReputationFactionData> {
    return apiClient.getReputationFaction(id) as Promise<ReputationFactionData>;
  }



}

interface ReputationTierTierData {
    name: string;
    min_value: number;
    max_number: number;
    id: number;
}


export interface ReputationTierData extends IApiDataDoc {
    _links?: linksStruct;
    id: number;
    tiers: ReputationTierTierData[];
    faction: refStruct;
}

interface ReputationTierIndexItem extends refStruct
{ }

export interface ReputationTierIndex extends IApiIndexDoc {
  _links: linksStruct;
  reputation_tiers: ReputationTierIndexItem[];
}

export class reputationTierDataDoc extends dbData<ReputationTierIndex, ReputationTierData> 
{
  constructor (parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "cake";
    this.itemsName = "reputation_tiers";
    this.type="reputation-tier";
    this.title="Reputation Tiers";
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<ReputationTierIndex> {
    return apiClient.getReputationTiersIndex() as Promise<ReputationTierIndex>;
  }

  override getAPIRec = function(apiClient: apiClientService, id: number): Promise<ReputationTierData> {
    return apiClient.getReputationTier(id) as Promise<ReputationTierData>;
  }

  override getRecName(rec: ReputationTierData): string {
      return rec.faction.name;
  }


}