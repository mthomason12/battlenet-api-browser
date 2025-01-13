import { Component, Output } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { UserdataService, dataStruct } from '../userdata/userdata.service';


@Component({
  selector: 'app-apitree',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './apitree.component.html',
  styleUrl: './apitree.component.scss'
})

export class ApitreeComponent {
  //dataSource = TREE_DATA;

  @Output()
  selectedItem!: dataStruct;

  dataSource: dataStruct[];

  childrenAccessor = (node: dataStruct) => node.children() ?? [];

  hasChild = (_: number, node: dataStruct) => !!node.children() && node.children().length > 0;

  constructor(private dataService: UserdataService)
  {
    this.dataSource = dataService.data.apiData.children();
  }

  select(item: dataStruct)
  {
    this.selectedItem = item;
    console.log("Selected "+item.name());
  }
}
