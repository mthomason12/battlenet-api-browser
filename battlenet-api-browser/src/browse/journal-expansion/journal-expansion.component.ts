import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../list-detail-host/abstract-detail/abstract-detail.component';
import { journalExpansionData } from '../../model/journal';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { IKeyValueTableData, KeyValueTableComponent } from '../../components/key-value-table/key-value-table.component';

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
