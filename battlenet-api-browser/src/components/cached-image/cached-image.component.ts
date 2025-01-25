import { Component, input, OnInit } from '@angular/core';
import { CachedFileService } from './cached-file.service';

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
export class CachedImageComponent implements OnInit{
  title = input<string>();
  src = input.required<string>();

  imageData?: string;

  constructor(private cacheSvc: CachedFileService) 
  {
  }
  
  ngOnInit(): void {
    this.cacheSvc.get(this.src()).then(
      (data)=>{
        this.imageData = "data:"+data.mimetype+";base64,"+data.data;
      }
    );
  }

}
