import { dataStruct, linksStruct, refStruct, mediaStruct, dataDetailDoc, mediaDataStruct, dbData, apiIndexDoc, apiDataDoc, IIndexItem, keyStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { RecDB } from '../lib/recdb';

//#region Covenants

interface covenantSpellTooltip
{
  spell: refStruct;
  description: string;
  cast_time: string;
  range: string;
  cooldown: string;
}

interface covenantClassAbility
{
  id: number;
  playable_class: refStruct;
  spell_tooltip: covenantSpellTooltip;
}

interface covenantRenownReward
{
  level: number;
  reward: refStruct;
}

interface covenantSignatureAbility
{
  id: number;
  spell_tooltip: covenantSpellTooltip;
}

export interface covenantData extends apiDataDoc
{
  _links?: linksStruct;
  id: number;
  name?: string;
  description?: string;
  signature_ability?: covenantSignatureAbility;
  class_abilities?: covenantClassAbility[];
  soulbinds?: refStruct[];
  renown_rewards?: covenantRenownReward[];
  media?: mediaStruct;
  mediaData?: mediaDataStruct;
}

interface covenantIndexItem extends IIndexItem
{
  key: keyStruct;
}

export interface covenantIndexData extends apiIndexDoc
{
  _links: linksStruct;
  covenants: covenantIndexItem[]
}


export class covenantsDataDoc extends dbData<covenantIndexData, covenantData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.itemsName = "covenants";
    this.type = "covenants";
    this.title = "Covenants";
  }

  override getAPIExtra(apiClient: ApiclientService, apiRec: covenantData): Promise<void> {
    return new Promise((resolve)=>{
      apiClient.getCovenantMedia(apiRec.id)?.then((data: any) => {
        apiRec.mediaData = data;
        resolve();
      });
    })
  }

  override getAPIIndex = function(apiClient: ApiclientService): Promise<covenantIndexData>
  {
    return apiClient.getCovenantIndex() as Promise<covenantIndexData>;
  }

  override getAPIRec = function(apiClient: ApiclientService, id: number): Promise<covenantData>
  {
    return apiClient.getCovenant(id) as Promise<covenantData>;
  }


}

//#endregion

//#region Soulbinds

interface soulbindFollowerData
{
  id: number;
  name: string;
}

export interface soulbindData extends apiDataDoc
{
  _links: linksStruct;
  id: number;
  name: string;
  covenant: refStruct;
  creature: refStruct;
  follower: soulbindFollowerData;
  talent_tree: refStruct;
}

interface soulbindIndexData extends apiIndexDoc
{
  _links: linksStruct;
  soulbinds: refStruct[];
}


export class soulbindDataDetailDoc extends dataDetailDoc
{
  _links?: linksStruct;
  covenant?: refStruct;
  creature?: refStruct;
  follower?: soulbindFollowerData;
  talent_tree?: refStruct;
}

export class soulbindsDataDoc extends dbData<soulbindIndexData, soulbindData>
{
  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent,recDB);
    this.icon = "people"; 
    this.itemsName = "soulbinds";
    this.type="soulbinds";
    this.title = "Soulbinds";
  }

  override getAPIIndex = function(apiClient: ApiclientService): Promise<soulbindIndexData>
  {
    return apiClient.getSoulbindIndex() as Promise<soulbindIndexData>;
  }

  override getAPIRec = function(apiClient: ApiclientService, id: number): Promise<soulbindData>
  {
    return apiClient.getSoulbind(id) as Promise<soulbindData>;
  }

}



//#endregion