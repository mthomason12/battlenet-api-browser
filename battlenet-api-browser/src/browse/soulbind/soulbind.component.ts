import { Component } from '@angular/core';
import { soulbindData } from '../../model/covenants';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';

@Component({
  selector: 'app-soulbind',
  imports: [ KeyValueTableComponent ],
  templateUrl: './soulbind.component.html',
  styleUrl: './soulbind.component.scss',
  inputs: ['data']
})

export class SoulbindComponent extends AbstractDetailComponent<soulbindData>{

      overviewData: IKeyValueTableData[] = [];
    
      override dataSet() {
        this.overviewData = [
          { key: 'ID', value: this.data?.id! },
          { key: 'Name', value: this.data?.name! },
          { key: 'Covenant', value: this.data?.covenant.name! },
        ]
      }
}
