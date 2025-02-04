import { EventEmitter, Injectable } from '@angular/core';
import _, {  } from 'lodash';
import { apiDataDoc, dataStruct, IMasterDetail, topDataStruct } from '../model/datastructs';
import { appKeyStruct, settingsStruct, userDataStruct } from '../model/userdata';
import { RecDB } from '../lib/recdb';

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
  public data: userDataStruct;
  /** class for accessing individually-stored records in IndexedDB */
  public recDB: RecDB = new RecDB('bnetapi-recdb','wow-data');
  /** reference to the current master-detail, folder, etc */
  private currentMaster?: dataStruct | IMasterDetail;
  /** reference to the current user-selected item */
  private currentData?: apiDataDoc;
  /** whether we've finished loading */
  public loaded: boolean = false;
  /** Event triggered when data has finished loading */
  public dataLoadedEmitter: EventEmitter<void> = new EventEmitter();  
  /** Event triggered when user selection is changed */
  public dataChangedEmitter: EventEmitter<{master: dataStruct | IMasterDetail, rec: apiDataDoc | undefined}> = new EventEmitter();

  //private dataCache: WeakMap<dataCacheKey, object> = new WeakMap();

  /** Event triggered when refresh button is pressed */
  public refreshRequestEmitter: EventEmitter<void> = new EventEmitter();

  constructor()
  {
    this.data = new userDataStruct(this.recDB);

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
    this.recDB.connect().then(()=>{
      this.fixup();       
      this.loaded = true;
      console.log("Data loaded");      
      //send a notification to any subscribers
      this.dataLoadedEmitter.emit();    
    });
  }

  /**
   * Save all settings data
   */
  save(): Promise<void>
  {
    return new Promise((resolve, reject)=>{
      localStorage.setItem(dataItem, JSON.stringify(this.data.key));
      localStorage.setItem(settingsItem, JSON.stringify(this.data.settings));    
      //save to indexedDB
      var saveList: Promise<any>[] = new Array(); 
      console.log("Data saved");      
      resolve();      
    });
  }
  
  exportJSON(): Promise<string>
  {
    return new Promise((resolve)=>{
      this.export().then((ob)=>{
        resolve(JSON.stringify(ob, null, 2));
      });
    });
  }

  /**
   * Export all data
   */
  export(): Promise<object>
  {
    return new Promise((resolve)=>{
      var exportOb: any = {};
      var promises: Promise<any>[] = [];
      this.data.apiData.children().forEach(element => {
        if (element instanceof topDataStruct)
        {
          promises.push(new Promise<void>((resolve)=>{
            element.export().then((ob)=>{
              exportOb[element.getName()] = ob;
              resolve();
            });
          }));
        }
      });
      Promise.allSettled(promises).then(()=>{
        resolve(exportOb);
      });
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
  setCurrent(master: dataStruct | IMasterDetail, data: apiDataDoc | undefined)
  {
    //if either have changed, inform subscribers
    if ((this.currentMaster !== master) || (this.currentData !== data))
    {
      this.currentMaster = master;
      this.currentData = data;
      this.dataChangedEmitter.emit({master:master, rec:data});
    }
  }

  /**
   * Get the current user-selected data struct
   * @returns 
   */
  getCurrent(): apiDataDoc
  {
    return this.currentData!;
  }

};
