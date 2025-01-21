import { EventEmitter, Injectable } from '@angular/core';
import { IDBPDatabase, openDB, OpenDBCallbacks } from 'idb';
import { jsonIgnoreReplacer } from 'json-ignore';
import { Reviver } from '@badcafe/jsonizer';
import _ from 'lodash';
import { dataStruct } from '../model/datastructs';
import { profileDataStruct } from '../model/profile';
import { publicDataStruct } from '../model/gamedata';

/**
 * All API data retrieved and stored in the application
 */
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

/**
 * Data for application API access - Client ID and Secret 
 */
class appKeyStruct
{
  clientID: string = "";
  clientSecret: string = "";
}

/**
 * All data held by {@link UserdataService}
 */
class userDataStruct
{
  key: appKeyStruct = new appKeyStruct();
  apiData: apiDataStruct = new apiDataStruct();
}

const dataItem: string = 'battlenet-api-data';

@Injectable({  providedIn: 'root',})

/**
 * Service to hold and maintain data in application
 */
export class UserdataService {
  /** mutable data held that can be loaded/saved */
  public data: userDataStruct = new userDataStruct();
  /** reference to the current user-selected item */
  private currentData?: dataStruct;
  /** whether we've finished loading */
  public loaded: boolean = false;
  /** Event triggered when data has finished loading */
  public dataLoadedEmitter: EventEmitter<boolean> = new EventEmitter();  
  /** Event triggered when user selection is changed */
  public dataChangedEmitter: EventEmitter<boolean> = new EventEmitter();

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
      (db) => {
        x = this.load(db, 'wowpublic', this.data.apiData.wowpublic, publicDataStruct);
        y = this.load(db, 'wowprofile', this.data.apiData.wowprofile, profileDataStruct);
        //wait for all data to be retrieved and merged then fixup to restore parent links, etc.
        Promise.allSettled([x,y]).then
        (_res => {   
          this.fixup();        
          console.log("Data loaded");
          this.loaded = true;
          //send a notification to any subscribers
          this.dataLoadedEmitter.emit(true)           
        });
      }
    );  
  }

  /**
   * Attempt to merge data from database into specified data structure
   * @param db 
   * @param query 
   * @param target 
   * @param classtype 
   * @returns 
   */
  load(db: IDBPDatabase<unknown>, query: string, target: any, classtype: any): Promise<any>
  {
    return db.get('data',query).then(
      (value) =>
        {
          if (value != undefined)
          {
            //create a new object consisting of the revived data merged into the target
            var newobj = _.merge(target, JSON.parse(value, Reviver.get(classtype)));
            //We can't replace an object reference by reference, so instead replace target keys with new object keys
            Object.keys(newobj).forEach(key => {
              target[key] = newobj[key];
          });            
          }
        }
    )
  }

  /**
   * Saves data structures to database
   */
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

  /**
   * fix up any references after reloading from JSON
   */
  fixup()
  {
      this.data.apiData.fixup();
  }

  /**
   * Set the current user-selected data struct
   * @param data 
   */
  setCurrent(data: dataStruct)
  {
    this.currentData = data;
    this.dataChangedEmitter.emit(true);
  }

  /**
   * Get the current user-selected data struct
   * @returns 
   */
  getCurrent(): dataStruct | undefined
  {
    return this.currentData;
  }
};
