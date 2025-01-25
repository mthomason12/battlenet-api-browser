import { Component, input } from '@angular/core';

/**
 * A simple <img> replacement.
 * Currently this is just a straight pass-through, but we're planning on making it
 * cache accessed images in indexedDB.
 */

@Component({
  selector: 'app-cached-image',
  imports: [],
  templateUrl: './cached-image.component.html',
  styleUrl: './cached-image.component.scss'
})
export class CachedImageComponent {
  title = input<string>();
  src = input.required<string>();
}
