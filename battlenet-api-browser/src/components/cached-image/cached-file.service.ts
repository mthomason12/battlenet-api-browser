import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CachedFileService {

  constructor() { }

  /** Store image in database */
  store(url: string, data: any)
  {

  }

  /** Retrieve image from database */
  retrieve(url: string, data: any)
  {

  }

  /** Get an image.  From database if possible, but if it's not there fetch and retrieve it*/
  get(url: string, data: any)
  {

  }
}
