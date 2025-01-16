import { dataDoc, dataStruct } from './datastructs';

export class charDataStruct extends dataStruct
{
}

export class charsDataStruct extends dataStruct
{
  items: charDataStruct[] = [];

  constructor(parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath);
  }

  override name(): string
  {
    return "Characters";
  }  

  override children(): dataStruct[]
  {
    return this.items;
  }    
}

export class profileDataStruct extends dataStruct
{
  characters: charsDataStruct;

  constructor(parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath);
    this.characters = new charsDataStruct(this._path, "characters");
  }

  override name(): string
  {
    return "Profile";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.characters]);
  }  
}