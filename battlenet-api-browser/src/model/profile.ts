import { dataFolder, dataStruct, topDataStruct } from './datastructs';
import { charsDataStruct } from './characters';
import { IDBPDatabase } from 'idb';

export class profileDataStruct extends topDataStruct
{
  accountFolder: dataFolder;
  characters: charsDataStruct;

  charactersFolder: dataFolder;

  guildsFolder: dataFolder;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.accountFolder = new dataFolder(this, "Account");
    this.characters = new charsDataStruct(this);
    this.accountFolder.add(this.characters);

    this.charactersFolder = new dataFolder(this, "Characters");

    this.guildsFolder = new dataFolder(this, "Guilds");

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Profile";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([
      this.accountFolder,
      this.charactersFolder, 
      this.guildsFolder
    ]);
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