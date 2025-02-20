import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { KeyValueTableComponent, IKeyValueTableData } from '../../../components/key-value-table/key-value-table.component';
import { journalExpansionData } from '../../../model/journal';
import { AbstractDetailComponent } from '../../list-detail-host/abstract-detail/abstract-detail.component';


@Component({
  selector: 'app-journal-expansion',
  imports: [ MatListModule, MatButtonModule, KeyValueTableComponent],
  templateUrl: './journal-expansion.component.html',
  styleUrl: './journal-expansion.component.scss',
  inputs: ['data']
})
export class JournalExpansionComponent extends AbstractDetailComponent<journalExpansionData>{
  overviewData: IKeyValueTableData[] = [];

  override dataSet() {
    this.overviewData = [
      { key: 'ID', value: this.data?.id! },
      { key: 'Name', value: this.data?.name! },
    ]
  }
}
