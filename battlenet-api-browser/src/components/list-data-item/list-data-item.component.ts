import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { dataDoc } from '../../model/datastructs';

@Component({
  selector: 'app-list-data-item',
  imports: [RouterLink],
  templateUrl: './list-data-item.component.html',
  styleUrl: './list-data-item.component.scss'
})
export class ListDataItemComponent {
  item = input.required<dataDoc>();
}
