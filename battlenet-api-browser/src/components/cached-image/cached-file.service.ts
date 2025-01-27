import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IDBPDatabase, openDB } from 'idb';
import { now } from 'lodash';

interface CachedFile{
  mimetype: string;
  data: string; //base64-encoded data
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
/**
 * A service for requesting file URLs from.  If the file has been requested before, it is served from the database.
 * Otherwise, it is retrieved and stored for later use.  Entries are timestamped.
 * 
 * Todo - add a "remove stale entries" function
 */
export class CachedFileService {

  httpClient: HttpClient = inject(HttpClient);
  db?: IDBPDatabase<unknown>;
  waiting: Promise<void | IDBPDatabase>;

  constructor() { 
    this.waiting = openDB('imgcache',2, {
      upgrade(db, oldVersion, newVersion, tx) {
        if (!db.objectStoreNames.contains('img'))
        {
          db.createObjectStore('img');
        }
        if (oldVersion < 2)
        {
          tx.objectStore('img').createIndex('timestamp', 'timestamp');
        }
      }
    }).then (
      (db) => {this.db = db}
    );
  }

  /** Store file in database */
  store(url: string, mimetype: string, data: string)
  {
    this.db?.put('img', {mimetype: mimetype, data: data, timestamp: now()}, url);
  }

  /** Retrieve file from database */
  retrieve(url: string): Promise<CachedFile | undefined>
  {
    var result = new Promise<CachedFile | undefined>((resolve,reject)=>{
      this.waiting.then(()=>{
        this.db?.get('img', url).then(
          (value)=>{
            if (value !== undefined)
            {
              resolve (value);
            }
            else
            {
              resolve (undefined);
            }
          }
        );
          // a pre-encoded red dot
          /*resolve({
          mimetype: 'image/jpeg',
          data: "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
          });*/
      });
    });
    return result;
  }

  /** 
   * Get a file. From database if possible, but if it's not there fetch and retrieve it.
   * This could also be used for pre- or background caching, but more than four concurrent calls should be run in a queue to ensure there's no timeouts.
   */
  get(url: string): Promise<CachedFile>
  {
    var result = new Promise<CachedFile>((resolve, reject)=>{
      this.retrieve(url).then(
        (data)=>{
          //data was found in database, return it
          if (data !== undefined)
          {
            resolve(data);
          }
          else
          {
          //data was not found in database, grab it from the internet and store then return it
          this.httpClient.get(url, {responseType: 'arraybuffer', observe: 'response'}).subscribe(
            response => {
              //todo - check response.status
              var mimetype: string = response.headers.get('Content-Type')!
              var data = btoa(String.fromCharCode(...new Uint8Array(response.body!)));
              this.store(url, mimetype, data);
              resolve({
                mimetype: mimetype,
                data: data,
                timestamp: now()
              })
            }
          );
          }
        }
      );
      
    });
    return result;
  }
}
