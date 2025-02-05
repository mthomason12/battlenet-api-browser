import { dataStruct, topDataStruct } from './datastructs';
import { charsDataDoc } from './account-characters';
import { RecDB } from '../lib/recdb';
import { heirloomsDataDoc } from './account-heirlooms';

export class accountDataStruct extends topDataStruct
{
  characters: charsDataDoc;
  heirlooms: heirloomsDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.characters = this.dbRegister(charsDataDoc);
    this.heirlooms = this.dbRegister(heirloomsDataDoc);

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