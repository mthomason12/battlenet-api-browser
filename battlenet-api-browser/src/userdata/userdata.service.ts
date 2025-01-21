import { EventEmitter, Injectable } from '@angular/core';
import { openDB } from 'idb';
import { jsonIgnoreReplacer } from 'json-ignore';
import { Reviver } from '@badcafe/jsonizer';
import _ from 'lodash';
import { dataStruct } from '../model/datastructs';
import { profileDataStruct } from '../model/profile';
import { publicDataStruct } from '../model/gamedata';

class apiDataStruct extends dataStruct
{
  wowpublic: publicDataStruct;
  wowprofile: profileDataStruct;

  constructor()
  {
    super(undefined);
    this.wowpublic = new publicDataStruct(this);
    this.wowprofile = new profileDataStruct(this);
  }

  override getName(): string
  {
    return "Battle.net API";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.wowpublic, this.wowprofile]);
  }

  override myPath(): string {
      return "browse";
  }

  //fix up any references after reloading from JSON
  override postFixup()
  {
      this.wowpublic.fixup(this);
      this.wowprofile.fixup(this);
  }
}

class appKeyStruct
{
  clientID: string = "";
  clientSecret: string = "";
}

class userDataStruct
{
  key: appKeyStruct = new appKeyStruct();
  apiData: apiDataStruct = new apiDataStruct();
}

const dataItem: string = 'battlenet-api-data';

@Injectable({  providedIn: 'root',})

export class UserdataService {
  public data: userDataStruct = new userDataStruct();
  currentData?: dataStruct;
  loaded: boolean = false;
  dataLoadedEmitter: EventEmitter<boolean> = new EventEmitter();  
  dataChangedEmitter: EventEmitter<boolean> = new EventEmitter();

  constructor()
  {
    var x: any,y: any;

    //attempt to load existing data from localstorage
    console.log("Initializing Data Storage");
    console.log("Loading application key");
    //load app keys first from LocalStorage
    try
    {
      var json = JSON.parse(localStorage.getItem(dataItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      }
      //console.log("Incoming Data: "+JSON.stringify(json));  
      this.data.key = _.merge(this.data.key, json)  
      //this.data = Object.assign(new userDataStruct(), json);
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("User data is corrupt or missing. Reinitializing with empty data.")   
      this.data = new userDataStruct();   
    }
    //load saved api data from IndexedDB
    console.log("Loading stored api data");
    const db = openDB('data',1, {
      upgrade(db) {
        db.createObjectStore('data');
      }
    }).then (
      db => {
        x = db.get('data','wowpublic').then (
          res => {
            if (res != undefined)
            {
              this.data.apiData.wowpublic = _.merge(this.data.apiData.wowpublic, JSON.parse(res, Reviver.get(publicDataStruct)));
            }
          }
        )
        y = db.get('data','wowprofile').then (
          res => {
            if (res != undefined)
            {
              this.data.apiData.wowprofile = _.merge(this.data.apiData.wowprofile, JSON.parse(res, Reviver.get(profileDataStruct)));
            }
          }
        );
        //wait for all data to be retrieved and merged then fixup to restore parent links, etc.
        Promise.allSettled([x,y]).then
        (_res => {   
          this.fixup();        
          console.log("Data loaded");
          this.loaded = true;
          this.dataLoadedEmitter.emit(true)           
        });
      }
    );  
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data.key));
    //save to indexedDB
    const db = openDB('data',1).then(
      db => {
        db.put('data', JSON.stringify(this.data.apiData.wowpublic, jsonIgnoreReplacer), 'wowpublic');
        db.put('data', JSON.stringify(this.data.apiData.wowprofile, jsonIgnoreReplacer), 'wowprofile');        
      }
    );      
  }

  //fix up any references after reloading from JSON
  fixup()
  {
      this.data.apiData.fixup();
  }

  setCurrent(data: dataStruct)
  {
    this.currentData = data;
    this.dataChangedEmitter.emit(true);
  }

  getCurrent(): dataStruct | undefined
  {
    return this.currentData;
  }
};
