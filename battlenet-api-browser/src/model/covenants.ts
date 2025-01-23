import { dataDoc, dataStruct, dataDocCollection, linksStruct, refStruct, mediaStruct, assetStruct } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';


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
  id: number;
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
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getCovenantIndex()?.then (
      (data: any) => {
        var json: string = JSON.stringify(data.covenants);
        const reviver = Reviver.get(covenantsDataDoc);
        console.dir(reviver);
        const covReviver = reviver['items'] as Reviver<covenantDataDoc[]>;
        this.items = JSON.parse(json, covReviver);
        this.postFixup();
        super.reload(apiclient);
      }
    );
  }

  override myPath(): string {
      return "covenants";
  }

}
