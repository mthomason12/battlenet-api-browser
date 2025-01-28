import { dataStruct, topDataStruct } from './datastructs';
import { charsDataDoc } from './account-characters';

export class accountDataStruct extends topDataStruct
{
  characterData: charsDataDoc;

  constructor(parent: dataStruct)
  {
    super(parent);
  
    this.characterData = this.register(charsDataDoc);

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