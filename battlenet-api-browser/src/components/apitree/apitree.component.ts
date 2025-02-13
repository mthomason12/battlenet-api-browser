import { Component, EventEmitter, OnDestroy, OnInit, Output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserdataService } from '../../services/userdata.service';
import { dataStruct } from '../../model/datastructs';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-apitree',
  imports: [ MatTreeModule, MatButtonModule, MatIconModule, RouterLink, CommonModule],
  templateUrl: './apitree.component.html',
  styleUrl: './apitree.component.scss'
})

export class ApitreeComponent implements OnInit, OnDestroy{
  //dataSource = TREE_DATA;

  @Output('valueChanged') changed = new EventEmitter<dataStruct>();

  tree = viewChild(MatTree);

  selectedItem: dataStruct | undefined;
  dataSource: dataStruct[];

  childrenAccessor = (node: dataStruct) => node.children() ?? [];
  hasChild = (_: number, node: dataStruct) => !!node.children() && node.children().length > 0;

  dataChangedSubscription?: Subscription;

  constructor(protected dataService: UserdataService)
  {
    this.dataSource = dataService.data.apiData.children();
  }

  ngOnInit(): void {
      this.dataChangedSubscription = this.dataService.dataChangedEmitter.subscribe(()=>{
        //open tree to selected item if needed
        this.selectedItem = (this.dataService.getCurrentMasterDetail()[0] as dataStruct);
        if (this.selectedItem) {
          this.expandUpwards(this.selectedItem);
        }
      });
  }

  ngOnDestroy(): void {
    this.dataChangedSubscription?.unsubscribe();
  }

  /** Recursively expand a node in the tree */
  expandUpwards(node: dataStruct) {
    this.tree()?.expand(node);
    if (node._parent) {
      this.expandUpwards(node._parent);
    }
  }

  select(item: dataStruct)
  {   
    this.selectedItem = item; 
    this.dataService.setCurrent(item, undefined);    
    this.changed.emit(this.selectedItem);      
  }
}
