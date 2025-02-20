import { Component} from '@angular/core';
import { KeyValueTableComponent, IKeyValueTableData } from '../../../components/key-value-table/key-value-table.component';
import { MediaTableComponent } from '../../../components/media-table/media-table.component';
import { achievementData } from '../../../model/achievements';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';



@Component({
  selector: 'app-achievement',
  imports: [MediaTableComponent, KeyValueTableComponent],
  templateUrl: './achievement.component.html',
  styleUrl: './achievement.component.scss',
  inputs: ['data']
})
export class AchievementComponent extends AbstractDetailComponent<achievementData>{

  overviewData: IKeyValueTableData[] = [];

  override dataSet() {
    this.overviewData = [
      { key: 'Name', value: this.data?.name! },
      { key: 'Category', value: this.data?.category?.name! },
      { key: 'Description', value: this.data?.description! },
      { key: 'Criteria', value: this.data?.criteria?.description! },
      { key: 'Points', value: this.data?.points! },
      { key: 'Is Account-wide', value: this.data?.is_account_wide! },
    ]
  }

}
