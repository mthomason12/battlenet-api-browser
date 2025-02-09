import { apiDataDoc, apiIndexDoc, dataStruct, factionStruct, genderStruct, hrefStruct, IIndexItem, linksStruct, realmStruct, refStruct } from './datastructs';
import { dbData, dbDataIndexOnly } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB, recID } from '../lib/recdb';


export interface accountProfileSummaryLinks extends linksStruct
{
  user: hrefStruct;
  profile: hrefStruct;
}

export interface accountProfileCharacterData extends apiDataDoc
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

interface accountProfileWoWAccountData extends IIndexItem
{
  id: number;
  characters: accountProfileCharacterData[];
}

export interface accountProfileIndex extends apiIndexDoc
{
  _links: accountProfileSummaryLinks;
  id?: recID;
  wow_accounts: accountProfileWoWAccountData[];
  characters?: accountProfileCharacterData[];
}


export class accountCharsDataDoc extends dbDataIndexOnly<accountProfileIndex>
{

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "group";
    this.needsAuth = true;
    this.type = "account-characters";
    this.itemsName = "characters";
    this.title = "Characters";
    this.hideKey = true;
    this.private = true;
  }

  override getAPIIndex = function(apiClient: apiClientService): Promise<accountProfileIndex>
  {
    return new Promise((resolve)=>{
      (apiClient.getAccountProfileSummary() as Promise<accountProfileIndex>).then ((index)=>{
        index.characters = new Array();
        //copy characters from each account into a single characters array
        for (let account of index.wow_accounts) {
          for (let character of account.characters)
          {
            character.account = account.id;
            index.characters.push (character);
          }
        }
        //sort character array alphabetically
        index.characters = index.characters.sort(function(a, b){return ('' + a.name).localeCompare(b.name!)})
        resolve(index);
      });
    });
  }

  override indexCompare(a: accountProfileCharacterData, b: accountProfileCharacterData)
  {
    return ('' + a.name).localeCompare(b.name!); 
  }

  override getIndexItemName(item: IIndexItem): string
  {
    const itm = (item as accountProfileCharacterData);
    return `${item.name} - L${itm.level} ${itm.playable_race?.name} ${itm.playable_class?.name} (${itm.realm?.name})`;
  }


}