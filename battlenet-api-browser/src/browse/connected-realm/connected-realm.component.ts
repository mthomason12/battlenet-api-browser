import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { connectedRealmData } from '../../model/connectedrealm';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';

@Component({
  selector: 'app-connected-realm',
  imports: [ MatListModule, MatButtonModule, RouterLink, KeyValueTableComponent ],
  templateUrl: './connected-realm.component.html',
  styleUrl: './connected-realm.component.scss',
  inputs: ['data']
})
export class ConnectedRealmComponent extends AbstractDetailComponent<connectedRealmData>{

  overviewData: IKeyValueTableData[] = [];

  override dataSet() {
    this.overviewData = [
      { key: 'ID', value: this.data?.id! },
      { key: 'Name', value: this.data?.name! },
      { key: 'Has Queue', value: this.data?.has_queue! },
      { key: 'Status', value: this.data?.status?.name! },
      { key: 'Population', value: this.data?.population?.name! }
    ]
  }

}
