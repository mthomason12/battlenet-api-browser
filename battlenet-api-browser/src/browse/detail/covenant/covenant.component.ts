import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { KeyValueTableComponent, IKeyValueTableData } from '../../../components/key-value-table/key-value-table.component';
import { MediaTableComponent } from '../../../components/media-table/media-table.component';
import { covenantData } from '../../../model/covenants';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';


@Component({
  selector: 'app-covenant',
  imports: [MatTabsModule, MatListModule, MatTableModule, MatButtonModule, RouterLink, MediaTableComponent,
    KeyValueTableComponent
  ],
  templateUrl: './covenant.component.html',
  styleUrl: './covenant.component.scss',
  inputs: ['data']
})

export class CovenantComponent extends AbstractDetailComponent<covenantData>{

  overviewData: IKeyValueTableData[] = [];

  override dataSet() {
    this.overviewData = [
      { key: 'Name', value: this.data?.name! },
      { key: 'Description', value: this.data?.description! },
    ]
  }

}