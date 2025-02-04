import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { accountProfileCharacterData, charsDataDoc } from '../../../model/account-characters';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import '../../../lib/utils';

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
    MatInputModule, MatSelectModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './character-table.component.html',
  styleUrl: './character-table.component.scss',
  inputs: ['data','clicked']
})
export class CharacterTableComponent extends AbstractMasterComponent<charsDataDoc>{
  displayedColumns: string[] = ['name','level','class','race','faction','server','account'];

  //data
  rows: charRow[] = new Array();
  accounts: number[] = new Array();
  dataSource: MatTableDataSource<charRow> = new MatTableDataSource();

  //filters
  accountFilter: number[] = new Array();

  @ViewChild(MatSort) sort?: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
    this.dataSource.filterPredicate = (data, filter)=>{
      return ((this.accountFilter.length == 0) || this.accountFilter.includes(data.account) )
    };
  }  

  filterChanged()
  {
    this.dataSource.filter = this.accountFilter.toString();
  }

  override dataSet(): void {
    this.data?.getIndex(this.api).then((idx)=>{
      this.index = idx;
      this.indexItems = this.data?.getIndexItems(idx!);
      //data has been set, lets clone over what we need
      this.dataSource.data.length=0;
      (this.indexItems! as accountProfileCharacterData[]).forEach((item)=>{
        this.dataSource.data.push(
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
      this.accounts = this.dataSource.data.map((value, index, array)=>{
        return value.account;
      }).onlyUnique();
      this.ref.detectChanges();
    });
  }
}
