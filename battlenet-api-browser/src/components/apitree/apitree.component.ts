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

  /**
   * Recursively expand a node in the tree
   * @param node 
   */
  expandUpwards(node: dataStruct) {
    console.log("Looking for "+node.getName());
    var anc = this.getAncestors(this.dataSource, node);
    anc?.forEach((nod)=>{
      this.tree()?.expand(nod);
    })
  }

  /**
   * Return array of ancestor nodes for a given node 
   * @param array 
   * @param name 
   * @returns 
   */
  getAncestors(array: dataStruct[], node: dataStruct): dataStruct[] | undefined {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === node) {
        return [array[i]];
      }    
      const a = this.getAncestors(array[i].children(), node);
      if (a !== undefined) {
        a?.unshift(array[i]);
        return a;
      }
    }
    return undefined;
  }

  select(item: dataStruct)
  {   
    this.selectedItem = item; 
    this.dataService.setCurrent(item, undefined);    
    this.changed.emit(this.selectedItem);      
  }
}
