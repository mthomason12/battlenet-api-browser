import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { jsonIgnoreReplacer } from 'json-ignore';
import _ from 'lodash';
import { dataStruct } from './datastructs';
import type { dataItem } from './datastructs';
import { profileDataStruct } from './profile';
import { publicDataStruct } from './gamedata';
export { achievementsDataDoc } from './gamedata';

class apiDataStruct extends dataStruct
{
  wowpublic: publicDataStruct;
  wowprofile: profileDataStruct;

  constructor()
  {
    super("","");
    this.wowpublic = new publicDataStruct(this._path,"public");
    this.wowprofile = new profileDataStruct(this._path,"profile");
  }

  override name(): string
  {
    return "Battle.net API";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.wowpublic, this.wowprofile]);
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

  constructor()
  {
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
        db.get('data','wowpublic').then (
          res => {
            if (res != undefined)
            {
              this.data.apiData.wowpublic = _.merge(this.data.apiData.wowpublic, JSON.parse(res));
            }
          }
        );
        db.get('data','wowprofile').then (
          res => {
            if (res != undefined)
            {
              this.data.apiData.wowprofile = _.merge(this.data.apiData.wowprofile, JSON.parse(res));
            }
          }
        );        
      }
    );
    //console.log("Data after loading: "+JSON.stringify(this.data));
    console.dir(this.data);    
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
    console.log("Saving data: "+JSON.stringify(this.data.apiData));        
  }

  setCurrent(data: dataStruct)
  {
    this.currentData = data;
  }

  getCurrent(): dataStruct | undefined
  {
    return this.currentData;
  }
};
