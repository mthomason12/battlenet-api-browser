import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { guildProfileData } from '../../model/profile-guild';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { MatTableModule } from '@angular/material/table';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';
import { guildRosterMemberStruct } from 'battlenet-api-types';
import { UserdataService } from '../../services/userdata.service';
import { apiDataStruct } from '../../model/userdata';

@Component({
  selector: 'app-guild',
  imports: [ MatTabsModule, MatTableModule, KeyValueTableComponent ],
  templateUrl: './guild.component.html',
  styleUrl: './guild.component.scss',
  inputs: ['data']
})
export class GuildComponent extends AbstractDetailComponent<guildProfileData>{

  overviewData: IKeyValueTableData [] = [];
  rosterColumns: string[] = ['name','level','class','race','faction','server'];
  rosterData: guildRosterEntry[] = [];

  userData = inject(UserdataService);

  override dataSet() {
    this.overviewData = [
      {key: 'Name', value: this.data?.name!},
      {key: 'ID', value: this.data?.id!},
      {key: 'Faction', value: this.data?.faction.name!},
      {key: 'Realm', value: this.data?.realm.name!},
    ]
    this.rosterData = this.data?.$rosterData?.members!.map((rec)=>{
      return new guildRosterEntry(rec, this.userData.data.apiData);
    }) as guildRosterEntry[];
  }

}

class guildRosterEntry {
  name: string;
  level: number;
  //class: string;

  constructor(rec: guildRosterMemberStruct, data: apiDataStruct)
  {
    this.name = rec.character.name;
    this.level = rec.character.level;
    //this.class = data.wowpublic.
  }
}

