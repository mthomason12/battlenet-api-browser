import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { accountProfileCharacterData, accountCharsDataDoc } from '../../../model/account-characters';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import '../../../lib/utils';
import { transform } from 'lodash';
import { MatButton, MatButtonModule } from '@angular/material/button';

interface charRow {
  name: string;
  level: number;
  class: string;
  race: string;
  faction: string;
  server: string;
  account: number;
}


@Component({
  selector: 'app-character-table',
  imports: [ MatTableModule, MatSortModule, MatExpansionModule, MatIconModule, MatFormFieldModule, 
    MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './character-table.component.html',
  styleUrl: './character-table.component.scss',
  inputs: ['data','clicked']
})
export class CharacterTableComponent extends AbstractMasterComponent<accountCharsDataDoc>{
  displayedColumns: string[] = ['name','level','class','race','faction','server','account'];

  //data
  rows: charRow[] = new Array();
  accounts: number[] = new Array();
  dataSource: MatTableDataSource<charRow> = new MatTableDataSource();

  //filters
  accountFilter: number[] = new Array();

  @ViewChild(MatSort) sort?: MatSort;

  ngAfterViewInit() {
  }  

  filterChanged()
  {
    this.dataSource.filter = this.accountFilter.toString();
  }

  override processData(): void {
    //data has been set, lets clone over what we need
    var source = new MatTableDataSource<charRow>();
    (this.indexItems! as accountProfileCharacterData[]).forEach((item)=>{
      source.data.push(
        {
          name: item.name!,
          level: item.level!,
          class: item.playable_class!.name,
          race: item.playable_race!.name,
          faction: item.faction!.name,
          server: item.realm!.name,
          account: item.account!
        }
      )
    });
    //get list of unique accounts
    this.accounts = source.data.map((value, index, array)=>{
      return value.account;
    }).onlyUnique();
    this.dataSource = source;
    this.dataSource.sort = this.sort!;
    this.dataSource.filterPredicate = (data, filter)=>{
      return ((this.accountFilter.length == 0) || this.accountFilter.includes(data.account) )
    };
  }

 
}
