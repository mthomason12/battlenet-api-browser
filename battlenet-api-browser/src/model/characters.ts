import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { dataDetailDoc, dataDoc, dataDocCollection, dataDocDetailsCollection, dataStruct, factionStruct, genderStruct, hrefStruct, linksStruct, realmStruct, refStruct } from './datastructs';
import { ApiclientService } from '../services/apiclient.service';
import { jsonIgnoreReplacer } from 'json-ignore';


interface accountProfileSummaryLinks extends linksStruct
{
  user: hrefStruct;
  profile: hrefStruct;
}

interface accountProfileCharacterData
{
  id: number;
  name: string;
  level?: number;
  character?: hrefStruct;
  protected_character?: hrefStruct;
  account?: number;
  realm?: realmStruct;
  playable_class?: refStruct;
  playable_race?: refStruct;
  gender?: genderStruct;
  faction?: factionStruct;
}

interface accountProfileWoWAccountData
{
  id: number;
  characters: accountProfileCharacterData[];
}

interface accountProfileSummaryData
{
  _links: accountProfileSummaryLinks;
  id: number;
  wow_accounts: accountProfileWoWAccountData[];
}

@Reviver<charDataDetailDoc>({
  '.': Jsonizer.Self.endorse(charDataDetailDoc),
})
export class charDataDetailDoc extends dataDetailDoc
{
  level?: number;
  character?: hrefStruct;
  protected_character?: hrefStruct;
  account?: number;
  realm?: realmStruct;
  playable_class?: refStruct;
  playable_race?: refStruct;
  gender?: genderStruct;
  faction?: factionStruct;
}

@Reviver<charDataDoc>({
  '.': Jsonizer.Self.endorse(charDataDoc),
})
export class charDataDoc extends dataDoc
{
  level?: number;
  character?: hrefStruct;
  protected_character?: hrefStruct;
  account?: number;
  realm?: realmStruct;
  playable_class?: refStruct;
  playable_race?: refStruct;
  gender?: genderStruct;
  faction?: factionStruct;
}


@Reviver<charsDataDoc>({
  '.': Jsonizer.Self.assign(charsDataDoc),
  items: {
    '*': charDataDoc
  }
})
export class charsDataDoc extends dataDocDetailsCollection<charDataDoc, charDataDetailDoc>
{

  constructor(parent: dataStruct)
  {
    super(parent, "Characters");
    this.icon = "group";
    this.needsauth = true;
    this.thisType = charsDataDoc;
    this.detailsType = charDataDetailDoc;
    this.dbkey="wow-a-characters";
    this.itemsName = "characters";
  }

  /**
   * Custom load mechanism as characters are inside account objects
   * @param apiclient 
   */
  override async reload(apiclient: ApiclientService)
  {
    await this.getItems!(apiclient).then (
      (data: accountProfileSummaryData) => {
        //clear array
        this.items.length = 0;
        for (let account of data.wow_accounts)
          {
            for (let character of account.characters)
            {
              character.account = account.id;
              var json = JSON.stringify(character);
              const reviver = Reviver.get(charDataDoc);
              this.items.push (JSON.parse(json, reviver));
            }
          }
        this.postFixup();
        this.lastupdate = new Date().getTime();
      }
    );
  }

  override getItems = function(apiClient: ApiclientService): Promise<accountProfileSummaryData>
  {
    return apiClient.getAccountProfileSummary() as Promise<accountProfileSummaryData>;
  }

  //getDetails is not called due to our reimplementation of reloadItem, so we don't need to override it

  /**
   * Override reloadItem to pull from items rather than an API call
   * @param apiclient 
   * @param key 
   */
  override async reloadItem(apiclient: ApiclientService, key: any)
  {
    var json: string = JSON.stringify(this.items.find(
      (data, index, array)=>{
        return key === (data as any)[this.key];
      }), jsonIgnoreReplacer);
    var entry = this.addDetailEntryFromJson(json, apiclient);
    entry.lastupdate = new Date().getTime();
  }

}