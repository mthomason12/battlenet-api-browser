import { CommonModule } from '@angular/common';
import { Component, inject, input, model, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  title: string;
  content: TemplateRef<any>
  noScroll?: boolean;
}

@Component({
  selector: 'app-dialog',
  imports: [ MatDialogModule, MatButtonModule, CommonModule ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent<T> {

  readonly dialogRef = inject(MatDialogRef<DialogComponent<T>>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);


  onNoClick(): void {
    this.dialogRef.close();
  }

}

