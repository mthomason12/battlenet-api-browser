import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserdataService } from '../../services/userdata.service';
import { dataDocDetailsCollection, dataStruct, dbData } from '../../model/datastructs';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-apitree',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './apitree.component.html',
  styleUrl: './apitree.component.scss'
})

export class ApitreeComponent {
  //dataSource = TREE_DATA;

  @Output('valueChanged') changed = new EventEmitter<dataStruct>();

  selectedItem: dataStruct | undefined;

  dataSource: dataStruct[];

  childrenAccessor = (node: dataStruct) => node.children() ?? [];

  hasChild = (_: number, node: dataStruct) => !!node.children() && node.children().length > 0;

  constructor(private dataService: UserdataService)
  {
    this.dataSource = dataService.data.apiData.children();
  }

  select(item: dataStruct)
  {   
    if (item instanceof dataDocDetailsCollection || item instanceof dbData)
    {
      this.selectedItem = item;   
      this.dataService.setCurrent(item, undefined);    
    }
    this.changed.emit(this.selectedItem);      
  }
}
