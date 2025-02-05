import { dataStruct, topDataStruct } from './datastructs';
import { accountCharsDataDoc } from './account-characters';
import { RecDB } from '../lib/recdb';
import { accountHeirloomsDataDoc } from './account-heirlooms';
import { accountMountsDataDoc } from './account-mounts';

export class accountDataStruct extends topDataStruct
{
  characters: accountCharsDataDoc;
  heirlooms: accountHeirloomsDataDoc;
  mounts: accountMountsDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.characters = this.dbRegister(accountCharsDataDoc);
    this.heirlooms = this.dbRegister(accountHeirloomsDataDoc);
    this.mounts = this.dbRegister(accountMountsDataDoc);

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
      this.heirlooms,
      this.mounts
    ]);
  }  

  override myPath(): string {
      return "account";
  }

}