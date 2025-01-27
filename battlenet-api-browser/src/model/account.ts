import { dataStruct, topDataStruct } from './datastructs';
import { charsDataDoc } from './characters';

export class accountDataStruct extends topDataStruct
{
  characters: charsDataDoc;

  constructor(parent: dataStruct)
  {
    super(parent);
  
    this.characters = this.register(charsDataDoc);

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
    ]);
  }  

  override myPath(): string {
      return "account";
  }

}