import { dataStruct, topDataStruct } from './datastructs';
import { achievementsDataDoc } from './achievements';
import { covenantsDataDoc, soulbindsDataDoc } from './covenants';
import { creatureFamiliesDataDoc, creatureTypesDataDoc } from './creature';
import { realmsDataDoc } from './realm';
import { mountsDataDoc } from './mounts';
import { connectedRealmsDataDoc } from './connectedrealm';
import { journalEncountersDataDoc, journalExpansionsDataDoc, journalInstancesDataDoc } from './journal';
import { RecDB } from '../lib/recdb';
import { petAbilitiesDataDoc, petsDataDoc } from './pets';
import { regionsDataDoc } from './region';

export class publicDataStruct extends topDataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;
  soulbindsData: soulbindsDataDoc;
  creatureFamiliesData: creatureFamiliesDataDoc;
  creatureTypesData: creatureTypesDataDoc;
  mountData: mountsDataDoc;
  pets: petsDataDoc;
  petAbilities: petAbilitiesDataDoc;
  realmData: realmsDataDoc;
  regionData: regionsDataDoc
  connectedRealmData: connectedRealmsDataDoc;
  journalExpansionData: journalExpansionsDataDoc;
  journalEncounterData: journalEncountersDataDoc;
  journalInstanceData: journalInstancesDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
 
    this.addFolder("Achievements",[
      this.achievementData = this.dbRegister(achievementsDataDoc)
    ]);

    this.addFolder("Covenants", [
      this.covenantData = this.dbRegister(covenantsDataDoc),
      this.soulbindsData = this.dbRegister(soulbindsDataDoc)
    ]);

    this.addFolder("Creatures",[
      this.creatureFamiliesData = this.dbRegister(creatureFamiliesDataDoc),
      this.creatureTypesData = this.dbRegister(creatureTypesDataDoc)
    ] );

    this.addFolder("Items");

    this.addFolder("Journal",[
      this.journalExpansionData = this.dbRegister(journalExpansionsDataDoc),
      this.journalEncounterData = this.dbRegister(journalEncountersDataDoc),
      this.journalInstanceData = this.dbRegister(journalInstancesDataDoc)
    ]);

    this.addFolder("Mythic Keystones");

    this.addFolder("Mounts",[
      this.mountData = this.dbRegister(mountsDataDoc)
    ]);

    this.addFolder("Pets",[
      this.pets = this.dbRegister(petsDataDoc),
      this.petAbilities = this.dbRegister(petAbilitiesDataDoc)
    ]);

    this.addFolder("Playables");

    this.addFolder("Professions");

    this.addFolder("PvP");

    this.addFolder("Quests");

    this.addFolder("Realms",[
      this.realmData = this.dbRegister(realmsDataDoc),
      this.connectedRealmData = this.dbRegister(connectedRealmsDataDoc)
    ]);

    this.addFolder("Regions",[
      this.regionData = this.dbRegister(regionsDataDoc)
    ])

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