import { RecDB } from '../lib/recdb';
import { dataStruct, topDataStruct } from './datastructs';
import { profileCharactersDataDoc } from './profile-characters';
import { profileGuildDataDoc } from './profile-guild';

export class profileDataStruct extends topDataStruct
{
  characters: profileCharactersDataDoc;
  guilds: profileGuildDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.addFolder("Characters", [
      this.characters = this.dbRegister(profileCharactersDataDoc),

    ]);

    this.addFolder("Guilds",[
      this.guilds = this.dbRegister(profileGuildDataDoc)
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