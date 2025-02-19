import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { guildProfileData } from '../../model/profile-guild';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { MatTableModule } from '@angular/material/table';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';
import { guildAchievement, guildActivity, guildCharacterAchievementActivity, guildEncounterActivity, guildRosterMemberStruct } from 'battlenet-api-types';
import { playableClassData } from '../../model/playable-class';
import { playableRaceData} from '../../model/playable-race';
import { dbDataLookups } from '../../model/dbdatalookups';
import { realmData } from '../../model/realm';
import { loadingSymbol, Slugify } from '../../lib/utils';
import { characterProfileData } from '../../model/profile-characters';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guild',
  imports: [MatTabsModule, MatTableModule, KeyValueTableComponent, CommonModule],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss',
  inputs: ['data']
})
export class GuildComponent extends AbstractDetailComponent<guildProfileData> {

  overviewData: IKeyValueTableData[] = [];
  rosterColumns: string[] = ['name', 'level', 'class', 'race', 'faction', 'realm'];
  rosterData: guildRosterEntry[] = [];
  achievementData: guildAchievement[] = [];
  activityData: (guildEncounterActivity | guildCharacterAchievementActivity)[] = [];

  constructor() {
    super();
    this.lookups.add([  
      {source: this.apiData.wowpublic, name: 'playable-class'},
      {source: this.apiData.wowpublic, name: 'playable-race'},
      {source: this.apiData.wowprofile, name: 'profile-characters'},
      {source: this.apiData.wowpublic, name: 'realms'}    
    ]);
  }

  override ngOnInit(): void {
  }

  override dataSet() {
    this.overviewData = [
      { key: 'Name', value: this.data?.name! },
      { key: 'ID', value: this.data?.id! },
      { key: 'Faction', value: this.data?.faction.name! },
      { key: 'Realm', value: this.data?.realm.name! },
      { key: 'Achievement Points', value: this.data?.achievement_points! },
      { key: 'Member Count', value: this.data?.member_count! },
    ]
    this.rosterData = this.data?.$rosterData?.members!.map((rec) => {
      return new guildRosterEntry(rec, this.lookups);
    }) as guildRosterEntry[];
    this.achievementData = this.data?.$achievementData?.achievements!;
    this.activityData = this.data?.$activityData?.activities!;
  }

}

class guildRosterEntry {
  name: string;
  level: number;
  class: string = "";
  race: string = "";
  faction: string;
  realm: string = "";


  constructor(rec: guildRosterMemberStruct, lookups: dbDataLookups) {
    this.name = rec.character.name;
    this.level = rec.character.level;
    this.class = loadingSymbol;
    this.race = loadingSymbol;
    this.faction = loadingSymbol; 
    this.realm = loadingSymbol;     

    lookups.lookup<playableClassData>('playable-class', rec.character.playable_class.id).then((res)=>{
      this.class = res?.name!;
    });
    lookups.lookup<playableRaceData>('playable-race', rec.character.playable_race.id).then((res)=>{
      this.race = res?.name!;    
    });    
    const charkey = Slugify(rec.character.name) + '@' + rec.character.realm.slug;
    lookups.lookup<characterProfileData>('profile-characters', charkey ).then((res)=>{
      this.faction = res?.faction.name!;
    }); 
    lookups.lookup<realmData>('realms', rec.character.realm.id).then((res)=>{
      this.realm = res?.name!;
    }); 
  }



}
