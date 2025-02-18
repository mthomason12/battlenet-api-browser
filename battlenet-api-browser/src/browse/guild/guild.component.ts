import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { guildProfileData } from '../../model/profile-guild';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { MatTableModule } from '@angular/material/table';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';
import { guildRosterMemberStruct } from 'battlenet-api-types';
import { UserdataService } from '../../services/userdata.service';
import { apiClientService } from '../../services/apiclient.service';
import { playableClassData } from '../../model/playable-class';
import { playableRaceData} from '../../model/playable-race';
import { dbDataLookups } from '../../model/dbdatalookups';
import { realmData } from '../../model/realm';

@Component({
  selector: 'app-guild',
  imports: [MatTabsModule, MatTableModule, KeyValueTableComponent],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss',
  inputs: ['data']
})
export class GuildComponent extends AbstractDetailComponent<guildProfileData> {

  overviewData: IKeyValueTableData[] = [];
  rosterColumns: string[] = ['name', 'level', 'class', 'race', 'faction', 'realm'];
  rosterData: guildRosterEntry[] = [];

  userData = inject(UserdataService);
  api = inject(apiClientService);
  apiData = this.userData.data.apiData;

  lookups: dbDataLookups = new dbDataLookups(this.apiData, this.api, [
    {source: this.apiData.wowpublic, name: 'playable-class'},
    {source: this.apiData.wowpublic, name: 'playable-race'},
    {source: this.apiData.wowpublic, name: 'realms'}    
  ]);

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
    lookups.lookup<playableClassData>('playable-class', rec.character.playable_class.id).then((res)=>{
      this.class = res?.name!;
    });
    lookups.lookup<playableRaceData>('playable-race', rec.character.playable_race.id).then((res)=>{
      this.race = res?.name!;
    });    
    this.faction = "";
    lookups.lookup<realmData>('realms', rec.character.realm.id).then((res)=>{
      this.realm = res?.name!;
    });       
  }
}
