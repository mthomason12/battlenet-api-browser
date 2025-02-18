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
import { playableRaceDataDoc } from './playable-race';
import { playableSpecDataDoc } from './playable-specialization';
import { playableClassDataDoc } from './playable-class';

export class publicDataStruct extends topDataStruct
{

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.icon = "folder";
 
    this.addFolder("Achievements",[
      this.Register(achievementsDataDoc)
    ]);

    this.addFolder("Covenants", [
      this.Register(covenantsDataDoc),
      this.Register(soulbindsDataDoc)
    ]);

    this.addFolder("Creatures",[
      this.Register(creatureFamiliesDataDoc),
      this.Register(creatureTypesDataDoc)
    ] );

    this.addFolder("Items", [
      this.Register(itemsDataDoc)
    ]);

    this.addFolder("Journal",[
      this.Register(journalExpansionsDataDoc),
      this.Register(journalEncountersDataDoc),
      this.Register(journalInstancesDataDoc)
    ]);

    this.addFolder("Mythic Keystones");

    this.addFolder("Mounts",[
      this.Register(mountsDataDoc)
    ]);

    this.addFolder("Pets",[
      this.Register(petsDataDoc),
      this.Register(petAbilitiesDataDoc)
    ]);

    this.addFolder("Playables",[
      this.Register(playableRaceDataDoc),
      this.Register(playableClassDataDoc),
      this.Register(playableSpecDataDoc),
    ]);

    this.addFolder("Professions");

    this.addFolder("PvP");

    this.addFolder("Quests");

    this.addFolder("Realms",[
      this.Register(realmsDataDoc),
      this.Register(connectedRealmsDataDoc)
    ]);

    this.addFolder("Regions",[
      this.Register(regionsDataDoc)
    ])

    this.addFolder("Reputations",[
      this.Register(reputationFactionDataDoc),
      this.Register(reputationTierDataDoc)
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