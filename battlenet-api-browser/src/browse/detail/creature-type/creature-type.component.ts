import { Component } from '@angular/core';
import { KeyValueTableComponent, IKeyValueTableData } from '../../../components/key-value-table/key-value-table.component';
import { creatureTypeData } from '../../../model/creature';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';


@Component({
  selector: 'app-creature-type',
  imports: [ KeyValueTableComponent ],
  templateUrl: './creature-type.component.html',
  styleUrl: './creature-type.component.scss',
  inputs: ['data']
})

export class CreatureTypeComponent extends AbstractDetailComponent<creatureTypeData>{

    overviewData: IKeyValueTableData[] = [];
  
    override dataSet() {
      this.overviewData = [
        { key: 'Name', value: this.data?.name! },
      ]
    }
}
