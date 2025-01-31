import { Component, input } from '@angular/core';
import { ObjToArray, propertyData } from '../../lib/utils';
import { MatTableModule } from '@angular/material/table';
import { isObject } from 'lodash';


@Component({
  selector: 'app-object-table',
  imports: [ MatTableModule ],
  templateUrl: './object-table.component.html',
  styleUrl: './object-table.component.scss'
})
/**
 * Angular component for displaying an object's properties as a table
 */
export class ObjectTableComponent {
    dataSource = input.required<Object>();

    displayedColumns: string[] = ['property', 'value'];

    rows(): propertyData[] {
      return ObjToArray(this.dataSource);
    }

    isObject(data: any): boolean {
      return isObject(data);
    }
}

