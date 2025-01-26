import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { dataDoc, dataDocCollection, dataStruct, factionStruct, genderStruct, hrefStruct, linksStruct, realmStruct, refStruct } from './datastructs';
import { ApiclientService } from '../apiclient/apiclient.service';


interface accountProfileSummaryLinks extends linksStruct
{
  user: hrefStruct;
  profile: hrefStruct;
}

interface accountProfileCharacterData
{
  id: number;
  name: string;
  level: number;
  character: hrefStruct;
  protected_character: hrefStruct;
  account?: number;
  realm: realmStruct;
  playable_class: refStruct;
  playable_race: refStruct;
  gender: genderStruct;
  faction: factionStruct;
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
export class charsDataDoc extends dataDocCollection<charDataDoc>
{

  constructor(parent: dataStruct)
  {
    super(parent, "Characters");
    this.icon = "group";
    this.needsauth = true;
    this.dbkey="wow-a-characters";
  }

  /**
   * Custom load mechanism as characters are inside account objects
   * @param apiclient 
   */
  override async reload(apiclient: ApiclientService)
  {
    await this.getItems!(apiclient).then (
      (data: accountProfileSummaryData) => {
        this.items = new Array();
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
        super.reload(apiclient);
      }
    );
  }

  override getName(): string
  {
    return "Characters";
  }  

  override children(): dataStruct[]
  {
    return this.items;
  }    

  override myPath(): string {
      return "characters";
  }
}