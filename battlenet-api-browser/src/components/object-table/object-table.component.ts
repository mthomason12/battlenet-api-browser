import { Component, input, OnInit } from '@angular/core';
import { ObjToArray, propertyData } from '../../lib/utils';
import { MatTableModule } from '@angular/material/table';
import { isObject } from 'lodash';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-object-table',
  imports: [ MatTableModule, CommonModule ],
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
      return ObjToArray(this.flattenObj(this.dataSource())).filter((value)=>{return value.name !== '_parent'});
    }

    objToArray(obj: any): propertyData[]
    {
      return ObjToArray(obj);
    }

    isObject(data: any): boolean {
      return isObject(data);
    }

    isArray(data: any): boolean {
      return Array.isArray(data);
    }

    flattenObj(ob: any): any {
 
      let result:any = {};
   
      // loop through object
      for (const i in ob) {
   
          // check value type and deal with appropriately
          if ((typeof ob[i]) === 'object') {
              const temp = this.flattenObj(ob[i]);
              for (const j in temp) {
   
                  // Store temp in result
                  result[i + '.' + j] = temp[j];
              }
          } 
   
          else {
              result[i] = ob[i];
          }
      }
      return result;
  };
  


}

