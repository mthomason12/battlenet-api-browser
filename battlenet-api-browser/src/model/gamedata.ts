import { dataStruct, topDataStruct, dataFolder } from './datastructs';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc } from './covenants';
import { jsonIgnoreReplacer } from 'json-ignore';
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
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;

  covenantsFolder: dataFolder;
  creaturesFolder: dataFolder;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.achievementData = new achievementsDataDoc(this);
    this.covenantData = new covenantsDataDoc(this);
    this.covenantsFolder = new dataFolder(this, "Covenants");
    this.covenantsFolder.add(this.covenantData);
    this.creaturesFolder = new dataFolder(this, "Creatures");
    this.icon = "folder";
  }

  override getName(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.achievementData, this.covenantsFolder, this.creaturesFolder]);
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