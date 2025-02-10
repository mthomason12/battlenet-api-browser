import { Component, inject, model } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IApiDataDoc } from '../../../model/datastructs';

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

  readonly dialog = inject(MatDialog);

  doSearch() {
    if (this.searchText.length > 0)
    {
      this.data?.getSearch(this.api, this.searchText).then((results)=>{
        const dialogRef = this.dialog.open(SearchResultsDialog, {
          width: "90%",
          data: {model: this.data, results: results}
        });
        
        dialogRef.afterClosed().subscribe(result =>{
          //clear the search box
          this.searchText = "";
          //
          if (Array.isArray(result)) {
            var res = result as Array<searchResult>;
            var entries = res.flatMap((value)=>{
              if (value.is_checked)
                return [value.item];
              else
                return [];
            });
            this.data?.addIndexItems(entries);
            //tell the component we've changed the data
            this.dataSet();
          }
        });
      })
    }
  }
}

interface searchDialogData {
  master: IMasterDetail,
  results: IApiDataDoc[]
}

interface searchResult
{
  item: IApiDataDoc,
  is_checked: boolean
}

@Component({
  selector: 'search-results-dialog',
  templateUrl: 'search-results-dialog.html',
  styleUrl: './generic-master-search.component.scss',
  imports: [
    MatButtonModule, MatDialogContent, MatDialogActions, 
    MatCheckboxModule, ScrollingModule,
    MatDialogClose, MatDialogTitle, CommonModule
  ],
})
export class SearchResultsDialog {
  readonly data = inject<searchDialogData>(MAT_DIALOG_DATA);
  readonly master: IMasterDetail = this.data.master;
  readonly _results = model(this.data.results);
  readonly results: searchResult[] = this._results().map((value)=>{
    return  { item: value, is_checked: false }
  })

  update (checked: boolean, item: searchResult)
  {
    item.is_checked = checked;
  }
}

