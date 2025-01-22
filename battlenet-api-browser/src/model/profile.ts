import { dataStruct, topDataStruct } from './datastructs';
import { charsDataStruct } from './characters';
import { IDBPDatabase } from 'idb';
import { jsonIgnoreReplacer } from 'json-ignore';

export class profileDataStruct extends topDataStruct
{
  characters: charsDataStruct;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.characters = new charsDataStruct(this);
    this.icon = "folder";
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

  override loadAll(db: IDBPDatabase<unknown>): Promise<any>[] {
    var entries: Promise<any>[] = new Array();
    entries.push(this.load(db, this.characters, charsDataStruct));
    return entries;
  }

  override save(db: IDBPDatabase<unknown>)
  {
    this.saveObject(db, this.characters);
  }
}