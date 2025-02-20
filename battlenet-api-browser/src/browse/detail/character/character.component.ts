import { Component } from '@angular/core';
import { characterProfileData } from '../../../model/profile-characters';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';
import { IKeyValueTableData, KeyValueTableComponent } from '../../../components/key-value-table/key-value-table.component';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-character',
  imports: [ MatTabsModule, KeyValueTableComponent ],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent extends AbstractDetailComponent<characterProfileData> {

  overviewData: IKeyValueTableData[] = [];

  override dataSet() {
    this.overviewData = [
      { key: 'Name', value: this.data?.name! },
      { key: 'ID', value: this.data?.id! },
      { key: 'Faction', value: this.data?.faction.name! },
      { key: 'Realm', value: this.data?.realm.name! },
      { key: 'Achievement Points', value: this.data?.achievement_points! },
    ]
  }

}
