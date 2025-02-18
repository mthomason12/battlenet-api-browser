import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface IKeyValueTableData {
    key: string;
    value: string | number;
}

@Component({
  selector: 'app-key-value-table',
  imports: [ MatTableModule ],
  templateUrl: './key-value-table.component.html',
  styleUrl: './key-value-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyValueTableComponent {
  
    ref = inject(ChangeDetectorRef);
    dataSource = input.required<IKeyValueTableData[]>()

}
