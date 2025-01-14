import { Component, EventEmitter, Output } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserdataService, dataStruct } from '../userdata/userdata.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-apitree',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule, RouterLink],
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
    //console.log("Selected "+item.name());     
    this.selectedItem = item;   
    this.changed.emit(this.selectedItem);
  }
}
