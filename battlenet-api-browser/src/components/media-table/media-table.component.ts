import { Component, input } from '@angular/core';
import { mediaDataStruct } from '../../model/datastructs';
import { MatTableModule } from '@angular/material/table';
import { CachedImageComponent } from '../cached-image/cached-image.component';

@Component({
  selector: 'app-media-table',
  imports: [MatTableModule, CachedImageComponent],
  templateUrl: './media-table.component.html',
  styleUrl: './media-table.component.scss'
})
export class MediaTableComponent {
  mediaData = input<mediaDataStruct>();
}
