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
    this.icon = "group";
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