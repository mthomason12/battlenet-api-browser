import { dataStruct, topDataStruct, dataFolder } from './datastructs';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc, soulbindsDataDoc } from './covenants';
import { creatureFamiliesDataDoc, creatureTypesDataDoc } from './creature';
import { realmsDataDoc } from './realm';
import { mountsDataDoc } from './mounts';

@Reviver<publicDataStruct>({
  '.': Jsonizer.Self.assign(publicDataStruct),
  achievementData: achievementsDataDoc,
  covenantData: covenantsDataDoc,
  creatureFamiliesData: creatureFamiliesDataDoc,
  creatureTypesData: creatureTypesDataDoc,
  mountData: mountsDataDoc,  
  realmData: realmsDataDoc
})
export class publicDataStruct extends topDataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;
  soulbindsData: soulbindsDataDoc;
  creatureFamiliesData: creatureFamiliesDataDoc;
  creatureTypesData: creatureTypesDataDoc;
  mountData: mountsDataDoc;
  realmData: realmsDataDoc;

  constructor(parent: dataStruct)
  {
    super(parent);
 
    this.addFolder("Achievements",[
      this.achievementData = this.register(achievementsDataDoc)
    ]);

    this.addFolder("Covenants", [
      this.covenantData = this.register(covenantsDataDoc),
      this.soulbindsData = this.register(soulbindsDataDoc)
    ]);

    this.addFolder("Creatures",[
      this.creatureFamiliesData = this.register(creatureFamiliesDataDoc),
      this.creatureTypesData = this.register(creatureTypesDataDoc)
    ] );

    this.addFolder("Items");

    this.addFolder("Journal");

    this.addFolder("Mythic Keystones");

    this.addFolder("Mounts",[
      this.mountData = this.register(mountsDataDoc)
    ]);

    this.addFolder("Pets");

    this.addFolder("Playable Classes");

    this.addFolder("Professions");

    this.addFolder("PvP");

    this.addFolder("Quests");

    this.addFolder("Realms",[
      this.realmData = this.register(realmsDataDoc)
    ]);

    this.addFolder("Reputations");

    this.addFolder("Talents");

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Game Data";
  }

  override myPath(): string {
      return "public";
  }

}