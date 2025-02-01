import { dataStruct, topDataStruct } from './datastructs';
import { Jsonizer, Reviver } from '@badcafe/jsonizer';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc, soulbindsDataDoc } from './covenants';
import { creatureFamiliesDataDoc, creatureTypesDataDoc } from './creature';
import { realmsDataDoc } from './realm';
import { mountsDataDoc } from './mounts';
import { connectedRealmsDataDoc } from './connectedrealm';
import { journalEncountersDataDoc, journalExpansionsDataDoc, journalInstancesDataDoc } from './journal';

@Reviver<publicDataStruct>({
  '.': Jsonizer.Self.assign(publicDataStruct),
  achievementData: achievementsDataDoc,
  covenantData: covenantsDataDoc,
  creatureFamiliesData: creatureFamiliesDataDoc,
  creatureTypesData: creatureTypesDataDoc,
  mountData: mountsDataDoc,  
  realmData: realmsDataDoc,
  connectedRealmData: connectedRealmsDataDoc,
  journalExpansionData: journalExpansionsDataDoc,
  journalEncounterData: journalEncountersDataDoc,
  journalInstanceData: journalInstancesDataDoc
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
  connectedRealmData: connectedRealmsDataDoc;
  journalExpansionData: journalExpansionsDataDoc;
  journalEncounterData: journalEncountersDataDoc;
  journalInstanceData: journalInstancesDataDoc;

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

    this.addFolder("Journal",[
      this.journalExpansionData = this.register(journalExpansionsDataDoc),
      this.journalEncounterData = this.register(journalEncountersDataDoc),
      this.journalInstanceData = this.register(journalInstancesDataDoc)
    ]);

    this.addFolder("Mythic Keystones");

    this.addFolder("Mounts",[
      this.mountData = this.register(mountsDataDoc)
    ]);

    this.addFolder("Pets");

    this.addFolder("Playables");

    this.addFolder("Professions");

    this.addFolder("PvP");

    this.addFolder("Quests");

    this.addFolder("Realms",[
      this.realmData = this.register(realmsDataDoc),
      this.connectedRealmData = this.register(connectedRealmsDataDoc)
    ]);

    this.addFolder("Reputations");

    this.addFolder("Spells");

    this.addFolder("Talents");

    this.addFolder("Titles");

    this.addFolder("Toys");

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