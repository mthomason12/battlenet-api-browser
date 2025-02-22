import { inject, Injectable } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent, DialogData } from '../components/dialog/dialog.component';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  readonly dialog = inject(MatDialog);

  constructor() { }

  open<T = undefined>(data: DialogData, options: MatDialogConfig<DialogData> = { width: "90%" }): MatDialogRef<DialogComponent<T>, any> {

    console.log("Opening Dialog");
    const dialogRef = this.dialog.open(DialogComponent, {
      ...options,
      data: data
    }); 
    return dialogRef;
  }
}
