import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import FileSaver from 'file-saver';
import { jsonIgnoreReplacer } from 'json-ignore';
import { dbData, IMasterDetail } from '../../../model/dbdatastructs';
import { dataStruct } from '../../../model/datastructs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserdataService } from '../../../services/userdata.service';

@Component({
  selector: 'app-data-tools',
  imports: [ MatIconModule, MatButtonModule, MatCardModule, MatDialogModule ],
  templateUrl: './data-tools.component.html',
  styleUrl: './data-tools.component.scss'
})
export class DataToolsComponent {
  ref = inject(ChangeDetectorRef);

  readonly dialog = inject(MatDialog);
  readonly userData = inject(UserdataService);

  private _snackBar = inject( MatSnackBar );

  private _rec?: any;
  private _filteredRec?: any;

  @Input({required: true})
  get data(): any | undefined {
    return this._rec!;
  }

  set data(value: any) {
    this._rec = value;
    this._filteredRec = this.filterData();
    this.ref.detectChanges();
  }

  name = input.required<string>();

  /**
   * Filter object by passing it through jsonIgnoreReplacer to remove any fields we don't want displayed.
   * Typically this is for fields that don't actually do anything on the current object, or fields that will
   * contain recursive data.
   * @returns 
   */
  filterData(): object
  {
    return JSON.parse(JSON.stringify(this.data, jsonIgnoreReplacer, 2));
  }

  clearItem()
  {
    if (this.data instanceof dbData){
      const dialogRef = this.dialog.open(ConfirmDeleteDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          var data = this.data as IMasterDetail;
          data.clear().then ( () => {
            this.userData.dataChangedEmitter.emit({ master:data, rec:undefined });
          });
        }
      });
    }
  }

  is_dbData(): boolean {
    return (this.data instanceof dbData);
  }

  dataType(): string {
    return (this.data as dataStruct).getName();
  }

  exportJSON()
  {
    if (this.data instanceof dbData)
    {
      this.data.export().then((ob)=>{
        this.doExport(ob);
      });
    }
    else
    {
      this.doExport(this.data);
    }
  }

  doExport(ob: object) {
    var fname = "battlenet-api-data-"+this.name()+".json";
    var blob = new Blob([JSON.stringify(ob, jsonIgnoreReplacer, 2)], {type: "text/json;charset=utf-8"});
    FileSaver.saveAs(blob, fname, { autoBom: true });
    this._snackBar.open("Data exported as "+fname, "", {duration:3000});
  }

}

@Component({
  selector: 'confirm-delete-dialog',
  templateUrl: 'confirm-delete-dialog.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteDialog 
{}