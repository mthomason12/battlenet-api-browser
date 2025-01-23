import { dataStruct, topDataStruct, dataFolder } from './datastructs';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc } from './covenants';
import { IDBPDatabase } from 'idb';
export * from './achievements';
export * from './covenants';

@Reviver<publicDataStruct>({
  '.': Jsonizer.Self.assign(publicDataStruct),
  achievementData: achievementsDataDoc,
  covenantData: covenantsDataDoc
})
export class publicDataStruct extends topDataStruct
{
  achievementFolder: dataFolder;
  achievementData: achievementsDataDoc;

  covenantsFolder: dataFolder;
  covenantData: covenantsDataDoc;

  creaturesFolder: dataFolder;

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
    this.achievementData = new achievementsDataDoc(this);
    this.achievementFolder = new dataFolder(this, "Achievements");
    this.achievementFolder.add(this.achievementData)

    this.covenantData = new covenantsDataDoc(this);
    this.covenantsFolder = new dataFolder(this, "Covenants");
    this.covenantsFolder.add(this.covenantData);

    this.creaturesFolder = new dataFolder(this, "Creatures");

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

  override postFixup(): void {
    this.achievementData.fixup(this);
    this.covenantData.fixup(this);
  }

  override loadAll(db: IDBPDatabase<unknown>): Promise<any>[] {
    var entries: Promise<any>[] = new Array();
    entries.push(this.load(db, this.achievementData, achievementsDataDoc));
    entries.push(this.load(db, this.covenantData, covenantsDataDoc));
    return entries;
  }

  override save(db: IDBPDatabase<unknown>)
  {
    this.saveObject(db, this.achievementData);
    this.saveObject(db, this.covenantData);
  }
}