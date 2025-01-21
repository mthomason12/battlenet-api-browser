import { dataStruct } from './datastructs';
import { charsDataStruct } from './characters';

export class profileDataStruct extends dataStruct
{
  characters: charsDataStruct;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.characters = new charsDataStruct(this);
  }

  override getName(): string
  {
    return "Profile";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.characters]);
  }  

  override myPath(): string {
      return "profile";
  }
}