import { dataStruct, topDataStruct } from './datastructs';
import { charsDataDoc } from './account-characters';
import { RecDB } from '../lib/recdb';

export class accountDataStruct extends topDataStruct
{
  characterData: charsDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.characterData = this.dbRegister(charsDataDoc);

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Account Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([
      this.characterData,
    ]);
  }  

  override myPath(): string {
      return "account";
  }

}