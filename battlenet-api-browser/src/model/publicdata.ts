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
import { reputationFactionDataDoc, reputationTierDataDoc } from './reputation';
import { itemsDataDoc } from './items';

export class publicDataStruct extends topDataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;
  soulbindsData: soulbindsDataDoc;
  creatureFamiliesData: creatureFamiliesDataDoc;
  creatureTypesData: creatureTypesDataDoc;
  mountData: mountsDataDoc;
  itemData: itemsDataDoc;
  pets: petsDataDoc;
  petAbilities: petAbilitiesDataDoc;
  realmData: realmsDataDoc;
  regionData: regionsDataDoc;
  reputationFactions: reputationFactionDataDoc;
  reputationTiers: reputationTierDataDoc;
  connectedRealmData: connectedRealmsDataDoc;
  journalExpansionData: journalExpansionsDataDoc;
  journalEncounterData: journalEncountersDataDoc;
  journalInstanceData: journalInstancesDataDoc;

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "folder";
 
    this.addFolder("Achievements",[
      this.achievementData = this.Register(achievementsDataDoc)
    ]);

    this.addFolder("Covenants", [
      this.covenantData = this.Register(covenantsDataDoc),
      this.soulbindsData = this.Register(soulbindsDataDoc)
    ]);

    this.addFolder("Creatures",[
      this.creatureFamiliesData = this.Register(creatureFamiliesDataDoc),
      this.creatureTypesData = this.Register(creatureTypesDataDoc)
    ] );

    this.addFolder("Items", [
      this.itemData = this.Register(itemsDataDoc)
    ]);

    this.addFolder("Journal",[
      this.journalExpansionData = this.Register(journalExpansionsDataDoc),
      this.journalEncounterData = this.Register(journalEncountersDataDoc),
      this.journalInstanceData = this.Register(journalInstancesDataDoc)
    ]);

    this.addFolder("Mythic Keystones");

    this.addFolder("Mounts",[
      this.mountData = this.Register(mountsDataDoc)
    ]);

    this.addFolder("Pets",[
      this.pets = this.Register(petsDataDoc),
      this.petAbilities = this.Register(petAbilitiesDataDoc)
    ]);

    this.addFolder("Playables");

    this.addFolder("Professions");

    this.addFolder("PvP");

    this.addFolder("Quests");

    this.addFolder("Realms",[
      this.realmData = this.Register(realmsDataDoc),
      this.connectedRealmData = this.Register(connectedRealmsDataDoc)
    ]);

    this.addFolder("Regions",[
      this.regionData = this.Register(regionsDataDoc)
    ])

    this.addFolder("Reputations",[
      this.reputationFactions = this.Register(reputationFactionDataDoc),
      this.reputationTiers = this.Register(reputationTierDataDoc)
    ]);

    this.addFolder("Spells");

    this.addFolder("Talents");

    this.addFolder("Titles");

    this.addFolder("Toys");
  }

  override getName(): string
  {
    return "Game Data";
  }

  override myPath(): string {
      return "public";
  }

}