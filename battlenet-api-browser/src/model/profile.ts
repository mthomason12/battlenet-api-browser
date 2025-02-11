import { RecDB } from '../lib/recdb';
import { dataStruct, topDataStruct } from './datastructs';
import { profileCharactersDataDoc } from './profile-characters';

export class profileDataStruct extends topDataStruct
{
  characterData: profileCharactersDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.addFolder("Characters", [
      this.characterData = this.dbRegister(profileCharactersDataDoc)
    ]);

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