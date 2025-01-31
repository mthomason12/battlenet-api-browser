import { Component, input, OnInit } from '@angular/core';
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
export class ObjectTableComponent implements OnInit {

    dataSource = input.required<Object>();

    displayedColumns: string[] = ['property', 'value'];

    data = new Array();

    ngOnInit(): void {
      this.data = this.rows();
    }

    rows(): propertyData[] {
      return ObjToArray(this.dataSource()).filter((value)=>{return value.name !== '_parent'});
    }

    isObject(data: any): boolean {
      return isObject(data);
    }
  


}

