import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { charsDataDoc } from '../../../model/account-characters';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { jsonIgnore } from 'json-ignore';

@Component({
  selector: 'app-character-table',
  imports: [ MatTableModule, MatSortModule ],
  templateUrl: './character-table.component.html',
  styleUrl: './character-table.component.scss',
  inputs: ['data','clicked']
})
export class CharacterTableComponent extends AbstractMasterComponent<charsDataDoc>{
  displayedColumns: string[] = ['name','level','class','race','faction','server'];

  @ViewChild(MatSort) sort?: MatSort;

  ngAfterViewInit() {
    //this.dataSource.sort = this.sort;
  }  
}
