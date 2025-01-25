import { dataStruct, topDataStruct, dataFolder } from './datastructs';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc, soulbindsDataDoc } from './covenants';
import { IDBPDatabase } from 'idb';
import { creatureFamiliesDataDoc, creatureTypesDataDoc } from './creature';

@Reviver<publicDataStruct>({
  '.': Jsonizer.Self.assign(publicDataStruct),
  achievementData: achievementsDataDoc,
  covenantData: covenantsDataDoc,
  creatureFamiliesData: creatureFamiliesDataDoc,
  creatureTypesData: creatureTypesDataDoc
})
export class publicDataStruct extends topDataStruct
{
  achievementFolder: dataFolder;
  achievementData: achievementsDataDoc;

  covenantsFolder: dataFolder;
  covenantData: covenantsDataDoc;
  soulbindsData: soulbindsDataDoc;

  creaturesFolder: dataFolder;
  creatureFamiliesData: creatureFamiliesDataDoc;
  creatureTypesData: creatureTypesDataDoc;

  itemsFolder: dataFolder;

  journalFolder: dataFolder;

  mythicKeystoneFolder: dataFolder;

  petFolder: dataFolder;

  playableClassFolder: dataFolder;

  pvpFolder: dataFolder;

  professionsFolder: dataFolder;

  questsFolder: dataFolder;

  reputationsFolder: dataFolder;

  talentsFolder: dataFolder;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.achievementData = this.register(achievementsDataDoc);
    this.achievementFolder = new dataFolder(this, "Achievements",[
      this.achievementData
    ]);

    this.covenantData = this.register(covenantsDataDoc);
    this.soulbindsData = this.register(soulbindsDataDoc);
    this.covenantsFolder = new dataFolder(this, "Covenants", [
      this.covenantData,
      this.soulbindsData
    ]);

    this.creaturesFolder = new dataFolder(this, "Creatures",[
      this.creatureFamiliesData = this.register(creatureFamiliesDataDoc),
      this.creatureTypesData = this.register(creatureTypesDataDoc)
    ] );

    this.itemsFolder = new dataFolder(this, "Items");

    this.journalFolder = new dataFolder(this, "Journal");

    this.mythicKeystoneFolder = new dataFolder(this, "Mythic Keystones");

    this.petFolder = new dataFolder(this, "Pets");

    this.playableClassFolder = new dataFolder(this, "Playable Classes");

    this.professionsFolder = new dataFolder(this, "Professions");

    this.pvpFolder = new dataFolder(this, "PvP");

    this.questsFolder = new dataFolder(this, "Quests");

    this.reputationsFolder = new dataFolder(this, "Reputations");

    this.talentsFolder = new dataFolder(this, "Talents");

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([
      this.achievementFolder, 
      this.covenantsFolder, 
      this.creaturesFolder,
      this.itemsFolder,
      this.journalFolder,
      this.mythicKeystoneFolder, 
      this.petFolder,
      this.playableClassFolder,
      this.professionsFolder,
      this.pvpFolder,
      this.questsFolder,
      this.reputationsFolder,
      this.talentsFolder
    ]);
  } 

  override myPath(): string {
      return "public";
  }

}