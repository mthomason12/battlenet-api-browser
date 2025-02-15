import { RecDB } from '../lib/recdb';
import { dataStruct, topDataStruct } from './datastructs';
import { profileCharactersDataDoc } from './profile-characters';
import { profileGuildDataDoc } from './profile-guild';

export class profileDataStruct extends topDataStruct
{

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.addFolder("Characters", [
      this.Register(profileCharactersDataDoc),

    ]);

    this.addFolder("Guilds",[
      this.Register(profileGuildDataDoc)
    ]);

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