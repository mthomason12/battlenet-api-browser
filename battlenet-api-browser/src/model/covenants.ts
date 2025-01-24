import { dataDoc, dataStruct, dataDocCollection, linksStruct, refStruct, mediaStruct, assetStruct } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { apiDataStruct } from './userdata';

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
  _links: linksStruct;
  id: number;
  name: string;
  description: string;
  signature_ability: covenantSignatureAbility;
  class_abilities: covenantClassAbility[];
  soulbinds: refStruct[];
  renown_rewards: covenantRenownReward[];
  media: mediaStruct;
}

@Reviver<covenantDataDoc>({
  '.': Jsonizer.Self.endorse(covenantDataDoc)
})
export class covenantDataDoc extends dataDoc
{
  title: string;
  data?: covenantData;
  media?: covenantMedia;

  constructor (parent: dataStruct, id: number, title: string)
  {
    super(parent,"Covenant: "+title);   
    this.id = id;
    this.title = title;
  }  

  override myPath(): string {
      return this.id.toString();
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getCovenant(this.id)?.then (
      async (data: any) => {
        this.data = data;
        await apiclient.getCovenantMedia(this.id)?.then(
          (data: any) => {
            this.media = data;
            this.postFixup();
            super.reload(apiclient);
          }
        )
      }
    );
  }
}


@Reviver<covenantsDataDoc>({
  '.': Jsonizer.Self.assign(covenantsDataDoc),
  items: {
    '*': covenantDataDoc
  }
})
export class covenantsDataDoc extends dataDocCollection<covenantDataDoc>
{
  constructor (parent: dataStruct)
  {
    super(parent,"Covenants");
    this.dbkey = "wow-p-covenants";
    this.thisType = covenantsDataDoc;
    this.itemsName = "covenants";
  }

  override getItems = function(apiClient: ApiclientService): Promise<any>
  {
    return apiClient.getCovenantIndex() as Promise<covenantData>;
  }

  override myPath(): string {
      return "covenants";
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
  '.': Jsonizer.Self.endorse(soulbindDataDoc)
})
export class soulbindDataDoc extends dataDoc
{
  title: string;
  data?: soulbindData;

  constructor (parent: dataStruct, id: number, title: string)
  {
    super(parent,"Covenant: "+title);   
    this.id = id;
    this.title = title;
  }  

  override myPath(): string {
      return this.id.toString();
  }

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


@Reviver<soulbindsDataDoc>({
  '.': Jsonizer.Self.assign(soulbindsDataDoc),
  items: {
    '*': soulbindDataDoc
  }
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