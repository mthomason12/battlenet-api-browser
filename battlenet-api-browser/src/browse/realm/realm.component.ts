import { Component } from '@angular/core';
import { realmData } from '../../model/realm';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';

@Component({
  selector: 'app-realm',
  imports: [ KeyValueTableComponent ],
  templateUrl: './realm.component.html',
  styleUrl: './realm.component.scss',
  inputs: ['data']
})
export class RealmComponent extends AbstractDetailComponent<realmData>{
    overviewData: IKeyValueTableData[] = [];
  
    override dataSet() {
      this.overviewData = [
        { key: 'ID', value: this.data?.id! },
        { key: 'Name', value: this.data?.name! },
        { key: 'Slug', value: this.data?.slug! },
        { key: 'Region', value: this.data?.region?.name! },
        { key: 'Category', value: this.data?.category! },
        { key: 'Locale', value: this.data?.locale! },
        { key: 'Time Zone', value: this.data?.timezone! },
        { key: 'Type', value: this.data?.type?.name! },
        { key: 'Is Tournament?', value: this.data?.is_tournament! },
      ]
    }
}