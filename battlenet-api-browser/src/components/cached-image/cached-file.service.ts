import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface CachedFile{
  mimetype: string;
  data: string; //base64-encoded data
}

@Injectable({
  providedIn: 'root'
})
export class CachedFileService {

  httpClient: HttpClient = inject(HttpClient);

  constructor() { }

  /** Store file in database */
  store(url: string, mimetype: string, data: string)
  {

  }

  /** Retrieve file from database */
  retrieve(url: string): Promise<CachedFile | undefined>
  {
    var result = new Promise<CachedFile | undefined>((resolve,reject)=>{
      //for now, just say no
      resolve(undefined);
      // a pre-encoded red dot
      /*resolve({
        mimetype: 'image/jpeg',
        data: "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
      });*/
    });
    return result;
  }

  /** Get a file.  From database if possible, but if it's not there fetch and retrieve it*/
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
              var mimetype: string = response.headers.get('Content-Type')!
              var data = btoa(String.fromCharCode(...new Uint8Array(response.body!)));
              this.store(url, mimetype, data);
              resolve({
                mimetype: mimetype,
                data: data
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
