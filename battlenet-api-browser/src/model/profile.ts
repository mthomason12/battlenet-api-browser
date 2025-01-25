import { dataFolder, dataStruct, topDataStruct } from './datastructs';
import { charsDataDoc } from './characters';
import { IDBPDatabase } from 'idb';

export class profileDataStruct extends topDataStruct
{
  accountFolder: dataFolder;
  characters: charsDataDoc;

  charactersFolder: dataFolder;

  guildsFolder: dataFolder;

  constructor(parent: dataStruct)
  {
    super(parent);
  
    this.accountFolder = new dataFolder(this, "Account", 
    [
      this.characters = this.register(charsDataDoc)
    ]);

    this.charactersFolder = new dataFolder(this, "Characters");

    this.guildsFolder = new dataFolder(this, "Guilds");

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Profile Data";
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

}