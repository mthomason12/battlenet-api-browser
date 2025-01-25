import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { dataDoc, dataDocDetailsCollection } from '../../model/datastructs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-list-data-item',
  imports: [MatButtonModule, RouterLink, MatIcon],
  templateUrl: './list-data-item.component.html',
  styleUrl: './list-data-item.component.scss'
})
export class ListDataItemComponent {
  item = input.required<dataDoc>();

  itemIsLoaded(): boolean
  {
    if (this.item()._parent instanceof dataDocDetailsCollection)
    {
      return (this.item()._parent as dataDocDetailsCollection<any,any>).hasDetailEntry(this.item().id);
    }
    return false;
  }
}
