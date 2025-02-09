import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IIndexItem } from '../../model/datastructs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { IMasterDetail } from '../../model/dbdatastructs';

@Component({
  selector: 'app-list-data-item',
  imports: [MatButtonModule, RouterLink, MatIcon, CommonModule],
  templateUrl: './list-data-item.component.html',
  styleUrl: './list-data-item.component.scss'
})
export class ListDataItemComponent {

  //the item to display
  item = input.required<IIndexItem>();

  //the item's parent
  parent = input.required<IMasterDetail>();

  //the item key
  key = input<string>('id');

  //whether to hide key from display
  hideKey = input<boolean>(false);

  //Whether to add a skipLocationChange directive
  skipChange = input<boolean>(false);

  //Function to call on click
  clicked = output<string>();

  itemKey(): string
  {
    return (this.item() as any)[this.key()];
  }

  itemName(): string
  {
    return this.parent().getIndexItemName(this.item());
  }

  itemLoaded(): boolean
  {
    return this.parent().isItemLoaded(this.itemKey());
  }

  shouldSkipChange(): boolean
  {
    if (this.parent().crossLink)
      return false;
    else
      return this.skipChange();
  }

}
