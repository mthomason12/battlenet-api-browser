import { dataFolder, dataStruct, topDataStruct } from './datastructs';

export class profileDataStruct extends topDataStruct
{

  charactersFolder: dataFolder;

  guildsFolder: dataFolder;

  constructor(parent: dataStruct)
  {
    super(parent);
  
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
      this.charactersFolder, 
      this.guildsFolder
    ]);
  }  

  override myPath(): string {
      return "profile";
  }

}