import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

export interface IKeyValueTableData {
    key: string;
    value: string | number | boolean;
    button?: {
      name: string;
      onClick: ()=>void;
    }
}

@Component({
  selector: 'app-key-value-table',
  imports: [ MatTableModule, MatButtonModule ],
  templateUrl: './key-value-table.component.html',
  styleUrl: './key-value-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KeyValueTableComponent {
  
    ref = inject(ChangeDetectorRef);
    dataSource = input.required<IKeyValueTableData[]>()

}
