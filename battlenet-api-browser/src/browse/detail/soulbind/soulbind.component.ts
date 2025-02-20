import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';
import { KeyValueTableComponent, IKeyValueTableData } from '../../../components/key-value-table/key-value-table.component';
import { soulbindData } from '../../../model/covenants';


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
