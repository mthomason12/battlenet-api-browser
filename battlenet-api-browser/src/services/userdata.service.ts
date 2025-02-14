import { EventEmitter, Injectable } from '@angular/core';
import _, {  } from 'lodash';
import { IApiDataDoc, dataStruct, topDataStruct } from '../model/datastructs';
import { extensionsDataStruct, settingsStruct, userDataStruct } from '../model/userdata';
import { RecDB } from '../lib/recdb';
import { IMasterDetail } from '../model/dbdatastructs';
import { HttpClient } from '@angular/common/http';
import JSONC from 'tiny-jsonc';

const settingsItem: string = 'battlenet-api-settings';
const extDataItem: string = 'battlenet-api-extdata';

interface dataCacheKey {
  type: string;
  id: string;
}


@Injectable({  providedIn: 'root',})
/**
 * Service to hold and maintain data in application
 * todo - migrate settings and extdata into recdb
 */
export class UserdataService {
  /** mutable data held that can be loaded/saved */
  public data: userDataStruct;
  /** class for accessing individually-stored records in IndexedDB */
  public recDB: RecDB = new RecDB('bnetapi-recdb','wow-data');
  /** reference to the current master-detail, folder, etc */
  private currentMaster?: dataStruct | IMasterDetail;
  /** reference to the current user-selected item */
  private currentData?: IApiDataDoc;
  /** whether we've finished loading */
  public loaded: boolean = false;
  /** Event triggered when data has finished loading */
  public dataLoadedEmitter: EventEmitter<void> = new EventEmitter();  
  /** Event triggered when user selection is changed */
  public dataChangedEmitter: EventEmitter<{master: dataStruct | IMasterDetail, rec: IApiDataDoc | undefined}> = new EventEmitter();
  /** Event triggered when current data is refreshed.  Typically called by external classes that affect the data */
  public dataRefreshedEmitter: EventEmitter<void> = new EventEmitter();
  /** Event triggered when application settings are changed */
  public settingsChangedEmitter: EventEmitter<void> = new EventEmitter();

  //private dataCache: WeakMap<dataCacheKey, object> = new WeakMap();

  /** Event triggered when refresh button is pressed */
  public refreshRequestEmitter: EventEmitter<void> = new EventEmitter();

  constructor(private http: HttpClient)
  {
    this.data = new userDataStruct(this.recDB);

    //attempt to load existing data from localstorage
    console.log("Initializing Data Storage");
    try
    {
      console.log("Loading settings");
      //load settings first from LocalStorage      
      var json = JSON.parse(localStorage.getItem(settingsItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      } 
      this.data.settings = _.merge(this.data.settings, json)
    }   
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("Settings are corrupt or missing. Reinitializing with empty data.")   
      this.data.settings = new settingsStruct();        
    }    
    try 
    {
      console.log("Loading extension data");
      //load extension data from LocalStorage
      json = JSON.parse(localStorage.getItem(extDataItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      } 
      this.data.extensions = _.merge(this.data.extensions, json)   
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("Extension data is corrupt or missing. Reinitializing with empty data.")   
      this.data.extensions = new extensionsDataStruct();           
    }
    //attempt to load policy file
    console.log("Loading policy");
    const base = document.baseURI;
    http.get(base+'policy.jsonc',{responseType:'text'}).subscribe({ 
      next: (response) => {
        //process the policy then finish initialization
        this.implementPolicy(JSONC.parse(response));
        this.finishInit();
      },
      error: (error) => {
        //we got an error, so just finish initialization
        this.finishInit();
      }
    });
    //this.finishInit();
  }

  finishInit() {
    this.recDB.connect().then(()=>{
      this.fixup();       
      this.loaded = true;
      console.log("Data loaded");      
      //send a notification to any subscribers
      this.dataLoadedEmitter.emit();  
      // Global variable to allow easy console access, and possibly for external Javascript addons later... 
      (window as any)['userData'] = this;  
    });
  }

  /**
   * Overwrite settings with policy
   * @param policy 
   */
  implementPolicy(policy: object) {
    console.log("Applying policy");
    this.data.settings = _.merge(this.data.settings, policy);
  }

  /**
   * Save all settings data
   */
  save(): Promise<void>
  {
    return new Promise((resolve, reject)=>{
      localStorage.setItem(settingsItem, JSON.stringify(this.data.settings));    
      localStorage.setItem(extDataItem, JSON.stringify(this.data.extensions));
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
  setCurrent(master: dataStruct | IMasterDetail, data: IApiDataDoc | undefined)
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
  getCurrent(): IApiDataDoc
  {
    return this.currentData!;
  }

  getCurrentMasterDetail(): [dataStruct | IMasterDetail, IApiDataDoc] {
    return [this.currentMaster!, this.currentData!];
  }

};
