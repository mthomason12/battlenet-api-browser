import { dataFolder, dataStruct, topDataStruct } from './datastructs';

export class profileDataStruct extends topDataStruct
{

  constructor(parent: dataStruct)
  {
    super(parent);
  
    this.addFolder("Characters");

    this.addFolder("Guilds");

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Profile Data";
  }

  override myPath(): string {
      return "profile";
  }

}