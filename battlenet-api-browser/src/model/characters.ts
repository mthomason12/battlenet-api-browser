import { dataDoc, dataStruct } from './datastructs';

export class charDataStruct extends dataStruct
{
}


export class charsDataStruct extends dataDoc
{
  items: charDataStruct[] = [];

  constructor(parent: dataStruct)
  {
    super(parent, "Characters");
    this.icon = "group";
    this.needsauth = true;
    this.dbkey="wow-u-characters";
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