import { dataStruct } from './datastructs';

export class charDataStruct extends dataStruct
{
}

export class charsDataStruct extends dataStruct
{
  items: charDataStruct[] = [];

  constructor(parent: dataStruct)
  {
    super(parent);
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