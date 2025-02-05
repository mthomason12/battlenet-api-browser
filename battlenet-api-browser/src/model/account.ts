import { dataStruct, topDataStruct } from './datastructs';
import { accountCharsDataDoc } from './account-characters';
import { RecDB } from '../lib/recdb';
import { accountHeirloomsDataDoc } from './account-heirlooms';

export class accountDataStruct extends topDataStruct
{
  characters: accountCharsDataDoc;
  heirlooms: accountHeirloomsDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.characters = this.dbRegister(accountCharsDataDoc);
    this.heirlooms = this.dbRegister(accountHeirloomsDataDoc);

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Account Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([
      this.characters, 
      this.heirlooms
    ]);
  }  

  override myPath(): string {
      return "account";
  }

}