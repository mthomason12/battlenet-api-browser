import { dataDoc, dataStruct, linksStruct, refStruct, mediaStruct, assetStruct, dataDocDetailsCollection, dataDetailDoc, dataDocCollection } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';

//#region Covenants

interface covenantMedia
{
  _links: linksStruct;
  assets: assetStruct[];
  id: number;
}

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

interface covenantData
{
  _links?: linksStruct;
  id?: number;
  name?: string;
  description?: string;
  signature_ability?: covenantSignatureAbility;
  class_abilities?: covenantClassAbility[];
  soulbinds?: refStruct[];
  renown_rewards?: covenantRenownReward[];
  media?: mediaStruct;
}

export interface covenantIndexData
{
  _links: linksStruct;
  covenants: refStruct[];
}

@Reviver<covenantDataDetailDoc>({
  '.': Jsonizer.Self.assign(covenantDataDetailDoc)
})
export class covenantDataDetailDoc extends dataDetailDoc
{
  media?: covenantMedia;

  override async getExtraDetails(apiClient: ApiclientService): Promise<void> 
  {
    await apiClient.getCovenantMedia(this.id)?.then(
      (data: any) => {
        this.media = data;
      });
  }
}

@Reviver<covenantDataDoc>({
  '.': Jsonizer.Self.assign(covenantDataDoc)
})
export class covenantDataDoc extends dataDoc
{
}


@Reviver<covenantsDataDoc>({
  '.': Jsonizer.Self.assign(covenantsDataDoc),
  items: {
    '*': covenantDataDoc
  },
  details: {
    '*': covenantDataDetailDoc
  }
})
export class covenantsDataDoc extends dataDocDetailsCollection<covenantDataDoc, covenantDataDetailDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent,"Covenants");
    this.dbkey = "wow-p-covenants";
    this.thisType = covenantsDataDoc;
    this.itemsName = "covenants";
  }

  override getItems = function(apiClient: ApiclientService): Promise<covenantIndexData>
  {
    return apiClient.getCovenantIndex() as Promise<covenantIndexData>;
  }

  override getDetails? = function(apiClient: ApiclientService, id: number): Promise<covenantData>
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

interface soulbindData
{
  _links: linksStruct;
  id: number;
  name: string;
  covenant: refStruct;
  creature: refStruct;
  follower: soulbindFollowerData;
  talent_tree: refStruct;
}

interface soulbindIndexData
{
  _links: linksStruct;
  soulbinds: refStruct[];
}


@Reviver<soulbindDataDoc>({
  '.': Jsonizer.Self.endorse(soulbindDataDoc),
  name: 'title'
})
export class soulbindDataDoc extends dataDoc
{
  data?: soulbindData;

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getSoulbind(this.id)?.then (
      async (data: soulbindData) => {
        this.data = data;
        this.postFixup();
        super.reload(apiclient);
      }
    );
  }
}

@Reviver<soulbindDataDetailDoc>({
  '.': Jsonizer.Self.endorse(soulbindDataDetailDoc),
  name: 'title'
})
export class soulbindDataDetailDoc extends dataDoc
{
}


@Reviver<soulbindsDataDoc>({
  '.': Jsonizer.Self.assign(soulbindsDataDoc),
  items: {
    '*': soulbindDataDoc
  },
})
export class soulbindsDataDoc extends dataDocCollection<soulbindDataDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent,"Soulbinds");
    this.dbkey = "wow-p-soulbinds";
    this.icon = "people"; 
    this.thisType = soulbindsDataDoc;
    this.itemsName = "soulbinds";
  }

  override getItems = function(apiClient: ApiclientService): Promise<soulbindIndexData>
  {
    return apiClient.getSoulbindIndex() as Promise<soulbindIndexData>;
  }

  override myPath(): string {
      return "soulbinds";
  }   
}



//#endregion