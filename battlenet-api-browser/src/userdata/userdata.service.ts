import { EventEmitter, Injectable } from '@angular/core';
import { openDB } from 'idb';
import _ from 'lodash';
import { dataStruct } from '../model/datastructs';
import { userDataStruct } from '../model/userdata';


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
    var loadList: Promise<any>[] = new Array();

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
    openDB('data',1, {
      upgrade(db) {
        db.createObjectStore('data');
      }
    }).then (
      (db) => {
        loadList = loadList.concat(this.data.apiData.wowpublic.loadAll(db));
        loadList = loadList.concat(this.data.apiData.wowprofile.loadAll(db));
        //wait for all data to be retrieved and merged then fixup to restore parent links, etc.
        Promise.allSettled(loadList).then
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


  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data.key));
    //save to indexedDB
    const db = openDB('data',1).then(
      db => {
        this.data.apiData.wowpublic.save(db);
        this.data.apiData.wowprofile.save(db);
      });
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
