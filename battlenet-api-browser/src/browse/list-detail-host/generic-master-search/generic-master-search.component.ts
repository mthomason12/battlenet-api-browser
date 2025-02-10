import { Component } from '@angular/core';
import { AbstractMasterComponent } from '../abstract-master/abstract-master.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ListDataItemComponent } from '../../../components/list-data-item/list-data-item.component';
import { IMasterDetail } from '../../../model/dbdatastructs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-generic-master-search',
  imports: [ 
    ScrollingModule,
    CommonModule,
    ListDataItemComponent,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule
  ],
  templateUrl: './generic-master-search.component.html',
  styleUrl: './generic-master-search.component.scss',
  inputs: ['data','clicked']
})
export class GenericMasterSearchComponent extends AbstractMasterComponent<IMasterDetail> {

  searchText: string = "";

  doSearch() {
    if (this.searchText.length > 0)
    {
    }
  }
}
