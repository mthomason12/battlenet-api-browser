import { Component } from '@angular/core';
import { AbstractDetailComponent } from '../abstract-detail/abstract-detail.component';
import { ObjectTableComponent } from "../../../components/object-table/object-table.component";
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-detail',
  imports: [ObjectTableComponent, MatTabsModule, CommonModule],
  templateUrl: './generic-detail.component.html',
  styleUrl: './generic-detail.component.scss',
  inputs: ['data'],
})
export class GenericDetailComponent extends AbstractDetailComponent<any>{

  mainData?: any = {};
  extraData: Map<string, any> = new Map();

  override dataSet(): void {
      //separate main data from extra data fields prefixed with a $
      console.dir(this.data);
      this.mainData = {};
      for (const property in this.data) {
        if (property.startsWith("$")) {
          this.extraData.set(property, this.data[property]);
        } else {
          this.mainData[property] = this.data[property];
        }
      }
  }
}
