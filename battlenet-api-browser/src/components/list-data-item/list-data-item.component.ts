import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { dataDoc, dataDocDetailsCollection } from '../../model/datastructs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-data-item',
  imports: [MatButtonModule, RouterLink, MatIcon, CommonModule],
  templateUrl: './list-data-item.component.html',
  styleUrl: './list-data-item.component.scss'
})
export class ListDataItemComponent {

  //the item to display
  item = input.required<dataDoc>();

  //the item key
  key = input<string>('id');

  //whether to hide key from display
  hideKey = input<boolean>(false);

  //Whether to add a skipLocationChange directive
  skipChange = input<boolean>(false);

  //Function to call on click
  clicked = output<string>();

  itemIsLoaded(): boolean
  {
    if (this.item()._parent instanceof dataDocDetailsCollection)
    {
      return (this.item()._parent as dataDocDetailsCollection<any,any>).hasDetailEntry(this.itemKey());
    }
    return false;
  }

  itemKey(): string
  {
    return (this.item() as any)[this.key()];
  }

}
