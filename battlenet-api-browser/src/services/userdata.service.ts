import { EventEmitter, Injectable } from '@angular/core';
import { openDB } from 'idb';
import _ from 'lodash';
import { dataStruct } from '../model/datastructs';
import { appKeyStruct, settingsStruct, userDataStruct } from '../model/userdata';
import FileSaver from 'file-saver';


const dataItem: string = 'battlenet-api-data';
const settingsItem: string = 'battlenet-api-settings';

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
  public dataLoadedEmitter: EventEmitter<void> = new EventEmitter();  
  /** Event triggered when user selection is changed */
  public dataChangedEmitter: EventEmitter<void> = new EventEmitter();

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
    openDB('data',1, {
      upgrade(db) {
        db.createObjectStore('data');
      }
    }).then (
      (db) => {
        loadList = loadList.concat(this.data.apiData.wowpublic.loadAll(db));
        loadList = loadList.concat(this.data.apiData.wowaccount.loadAll(db));        
        loadList = loadList.concat(this.data.apiData.wowprofile.loadAll(db));
        //wait for all data to be retrieved and merged then fixup to restore parent links, etc.
        Promise.allSettled(loadList).then
        (_res => {   
          this.fixup();        
          console.log("Data loaded");
          this.loaded = true;
          //send a notification to any subscribers
          this.dataLoadedEmitter.emit()           
        });
      }
    ); 
  }

  /**
   * Save all data
   */
  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data.key));
    localStorage.setItem(settingsItem, JSON.stringify(this.data.settings));    
    //save to indexedDB
    const db = openDB('data',1).then(
      db => {
        this.data.apiData.wowpublic.save(db);
        this.data.apiData.wowaccount.save(db);        
        this.data.apiData.wowprofile.save(db);
      });
  }

  /**
   * Export all data to JSON
   */
  export()
  {
    var obj = new Object();
    this.data.apiData.wowpublic.export(obj,'wowpublic');
    this.data.apiData.wowaccount.export(obj,'wowaccount');
    this.data.apiData.wowprofile.export(obj,'wowprofile');
    var json = JSON.stringify(obj);
    var blob = new Blob([json], {type: "text/json;charset utf-8"});
    FileSaver.saveAs(blob, "battlenet-api-data.json");
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
};
