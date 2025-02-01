import { EventEmitter, Injectable } from '@angular/core';
import { openDB } from 'idb';
import _, { StringNullableChain } from 'lodash';
import { dataStruct } from '../model/datastructs';
import { appKeyStruct, settingsStruct, userDataStruct } from '../model/userdata';
import { RecDB, recID } from '../lib/recdb';

const dataItem: string = 'battlenet-api-data';
const settingsItem: string = 'battlenet-api-settings';

interface dataCacheKey {
  type: string;
  id: string;
}

@Injectable({  providedIn: 'root',})
/**
 * Service to hold and maintain data in application
 */
export class UserdataService {
  /** mutable data held that can be loaded/saved */
  public data: userDataStruct = new userDataStruct();
  /** class for accessing individually-stored records in IndexedDB */
  public recDB: RecDB = new RecDB('bnetapi-recdb','wow-data');
  /** reference to the current user-selected item */
  private currentData?: dataStruct;
  /** whether we've finished loading */
  public loaded: boolean = false;
  /** Event triggered when data has finished loading */
  public dataLoadedEmitter: EventEmitter<void> = new EventEmitter();  
  /** Event triggered when user selection is changed */
  public dataChangedEmitter: EventEmitter<void> = new EventEmitter();

  private dataCache: WeakMap<dataCacheKey, object> = new WeakMap();

  /** Event triggered when refresh button is pressed */
  public refreshRequestEmitter: EventEmitter<void> = new EventEmitter();

  constructor()
  {
    var loadList: Promise<any>[] = new Array();  
    //attempt to load existing data from localstorage
    console.log("Initializing Data Storage");
    try
    {
      console.log("Loading settings");
      //load app keys first from LocalStorage      
      var json = JSON.parse(localStorage.getItem(settingsItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      } 
      this.data.key = _.merge(this.data.settings, json)
    }   
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("Settings are corrupt or missing. Reinitializing with empty data.")   
      this.data.settings = new settingsStruct();        
    }     
    try
    {         
      console.log("Loading application key");
      //load app keys first from LocalStorage      
      json = JSON.parse(localStorage.getItem(dataItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      } 
      this.data.key = _.merge(this.data.key, json)       
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("User data is corrupt or missing. Reinitializing with empty data.")   
      this.data.key = new appKeyStruct();         
    }
    //load saved api data from IndexedDB
    console.log("Loading stored api data");
    openDB('data',3, {
      upgrade(db, oldversion, newversion) {
        if (oldversion < 1)
          db.createObjectStore('data');
        if (oldversion < 3)
          db.deleteObjectStore('recordstore');
      }
    }).then (
      (db) => {
        //complete connection to recDB first as it could be needed at any time
        this.recDB.connect().then(()=>{
          //load data stores
          loadList = loadList.concat(this.data.apiData.wowpublic.loadAll(db, this));
          loadList = loadList.concat(this.data.apiData.wowaccount.loadAll(db, this));        
          loadList = loadList.concat(this.data.apiData.wowprofile.loadAll(db, this));
          loadList = loadList.concat(this.recDB.connect());
          //wait for all data to be retrieved and merged then fixup to restore parent links, etc.
          Promise.allSettled(loadList).then
          (_res => {   
            this.fixup();        
            console.log("Data loaded");
            this.loaded = true;
            //send a notification to any subscribers
            this.dataLoadedEmitter.emit()           
          });
        });
      }
    ); 
  }

  /**
   * Save all data
   */
  save(): Promise<void>
  {
    return new Promise((resolve, reject)=>{
      localStorage.setItem(dataItem, JSON.stringify(this.data.key));
      localStorage.setItem(settingsItem, JSON.stringify(this.data.settings));    
      //save to indexedDB
      var saveList: Promise<any>[] = new Array(); 
      const db = openDB('data',3).then(
        db => {
          saveList = saveList.concat(this.data.apiData.wowpublic.save(db));
          saveList = saveList.concat(this.data.apiData.wowaccount.save(db));        
          saveList = saveList.concat(this.data.apiData.wowprofile.save(db));
        });
      Promise.allSettled(saveList).then(
        ()=>{
          console.log("Data saved");
          resolve();
        }
      );
      
    });
  }

  /**
   * Export all data to JSON
   */
  export(): string
  {
    var obj = new Object();
    this.data.apiData.wowpublic.export(obj,'wowpublic');
    this.data.apiData.wowaccount.export(obj,'wowaccount');
    this.data.apiData.wowprofile.export(obj,'wowprofile');
    var json = JSON.stringify(obj);
    return json;
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
    this.dataChangedEmitter.emit();
  }

  /**
   * Get the current user-selected data struct
   * @returns 
   */
  getCurrent(): dataStruct | undefined
  {
    return this.currentData;
  }

  /**
   * Retrieve record from database
   * @param type 
   * @param id 
   * @returns 
   */
  getDBRec<T>(type: string, id: recID): Promise<T | undefined>
  {
    return new Promise<T | undefined>((resolve,reject)=>{
      this.recDB.get(type, id)?.then((res)=>{
        if (res === undefined)
          resolve(undefined)
        else
          resolve(res.data as T);
      }
    );
    });
  }

  /**
   * Retrieve all records of type 
   * @param type
   * @returns 
   */
  getDBRecs<T>(type: string): Promise<T[]>
  {
    return new Promise<T[]>((resolve,reject)=>{
      this.recDB.getAll(type).then((res)=>{
        resolve(res.map( (value)=> value.data) as T[] );
      });
    });
  }

  putDBRec(type: string, id: recID, record: object): Promise<IDBValidKey>
  {
    var recDB = this.recDB;
    return new Promise((resolve, reject)=>{
      recDB.delete(type, id).then(()=> {
        recDB.add(type, id, record as object).then ((result)=>{
          resolve(result);
        })
      });
    });
  }
};
