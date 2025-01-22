import { dataFolder, dataStruct } from './datastructs';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc } from './covenants';
export * from './achievements';
export * from './covenants';

@Reviver<publicDataStruct>({
  '.': Jsonizer.Self.assign(publicDataStruct),
  achievementData: achievementsDataDoc,
  covenantData: covenantsDataDoc
})
export class publicDataStruct extends dataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;

  covenantsFolder: dataFolder;

  constructor(parent: dataStruct)
  {
    super(parent);
    this.achievementData = new achievementsDataDoc(this);
    this.covenantData = new covenantsDataDoc(this);
    this.covenantsFolder = new dataFolder(this, "Covenants");
    this.icon = "folder";
  }

  override getName(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.achievementData, this.covenantData]);
  } 

  override myPath(): string {
      return "public";
  }

  override postFixup(): void {
    this.achievementData.fixup(this);
    this.covenantData.fixup(this);
  }
}