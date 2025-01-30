import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { charsDataDoc } from '../../../model/account-characters';
import { MatSort, MatSortModule } from '@angular/material/sort';

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
  imports: [ MatTableModule, MatSortModule ],
  templateUrl: './character-table.component.html',
  styleUrl: './character-table.component.scss',
  inputs: ['data','clicked']
})
export class CharacterTableComponent extends AbstractMasterComponent<charsDataDoc>{
  displayedColumns: string[] = ['name','level','class','race','faction','server','account'];

  rows: charRow[] = new Array();
  dataSource: MatTableDataSource<charRow> = new MatTableDataSource();

  @ViewChild(MatSort) sort?: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }  

  override dataSet(): void {
    //data has been set, lets clone over what we need
    this.dataSource.data.length=0;
    this.data!.items.forEach((item)=>{
      this.dataSource.data.push(
        {
          name: item.name,
          level: item.level!,
          class: item.playable_class!.name,
          race: item.playable_race!.name,
          faction: item.faction!.name,
          server: item.realm!.name,
          account: item.account!
        }
      )
    });
  }
}
