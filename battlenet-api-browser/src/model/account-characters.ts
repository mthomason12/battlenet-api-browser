import { IApiIndexDoc, dataStruct, IIndexItem } from './datastructs';
import { dbDataIndexOnly } from './dbdatastructs';
import { apiClientService } from '../services/apiclient.service';
import { RecDB, recID } from '../lib/recdb';
import { APIAccountProfileCharacter, APIAccountProfileSummary } from 'battlenet-api-types';


export interface accountProfileIndex extends APIAccountProfileSummary, IApiIndexDoc {
  id?: recID;
  characters?: APIAccountProfileCharacter[];
}

//todo - also pull the protected character profile summary

export class accountCharsDataDoc extends dbDataIndexOnly<accountProfileIndex> {

  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.icon = "group";
    this.needsAuth = true;
    this.type = "account-characters";
    this.itemsName = "characters";
    this.title = "Characters";
    this.hideKey = true;
    this.private = true;
  }

  override getAPIIndex = function (apiClient: apiClientService): Promise<accountProfileIndex> {
    return new Promise((resolve) => {
      (apiClient.getAccountProfileSummary() as Promise<accountProfileIndex>).then((index) => {
        index.characters = new Array();
        //copy characters from each account into a single characters array
        for (let account of index.wow_accounts) {
          for (let character of account.characters) {
            character.account = account.id;
            index.characters.push(character);
          }
        }
        //sort character array alphabetically
        index.characters = index.characters.sort(function (a, b) { return ('' + a.name).localeCompare(b.name!) })
        resolve(index);
      });
    });
  }

  override indexCompare(a: APIAccountProfileCharacter, b: APIAccountProfileCharacter) {
    return ('' + a.name).localeCompare(b.name!);
  }

  override getIndexItemName(item: IIndexItem): string {
    const itm = (item as APIAccountProfileCharacter);
    return `${item.name} - L${itm.level} ${itm.playable_race?.name} ${itm.playable_class?.name} (${itm.realm?.name})`;
  }


}