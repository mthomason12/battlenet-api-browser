import { Component } from '@angular/core';
import { creatureFamilyData } from '../../model/creature';
import { MediaTableComponent } from "../../components/media-table/media-table.component";
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';

@Component({
  selector: 'app-creature-family',
  imports: [MediaTableComponent, KeyValueTableComponent ],
  templateUrl: './creature-family.component.html',
  styleUrl: './creature-family.component.scss',
  inputs: ['data']
})
export class CreatureFamilyComponent extends AbstractDetailComponent<creatureFamilyData>{
    overviewData: IKeyValueTableData[] = [];
  
    override dataSet() {
      this.overviewData = [
        { key: 'Name', value: this.data?.name! },
      ]
    }
}
