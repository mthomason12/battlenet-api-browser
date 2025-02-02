import { IDBPDatabase } from 'idb';
import { ApiclientService } from '../services/apiclient.service';
import { jsonIgnore, jsonIgnoreReplacer } from 'json-ignore';
import _ from 'lodash';
import { Class, Reviver } from '@badcafe/jsonizer';
import { JobQueueService } from '../services/jobqueue.service';
import { RecDB, recID } from '../lib/recdb';
import { UserdataService } from '../services/userdata.service';
import { inject } from '@angular/core';
import { apiDataStruct } from './userdata';

//#region dataStruct

/**
 * A generic data structure
 */
export abstract class dataStruct implements apiDataDoc {
  @jsonIgnore()
  _parent?: dataStruct;
  @jsonIgnore()
  icon: string = "";
  lastUpdate: number | undefined;

  constructor (parent?: dataStruct)
  {
    this._parent = parent;
    this.icon = "article";
  }

  getName(): string
  {
    return "";
  }

  children(): dataStruct[]
  {
    return [];
  }

  /**
   * @returns true if this structure is supposed to contain data, otherwise false
   */
  hasData(): boolean
  {
    return false;
  }

  /**
   * Reload data from API
   * @param apiclient 
   */
  async reload(_apiclient: ApiclientService): Promise<apiDataDoc>
  {
    this.postProcess();
    return new Promise((resolve)=>{resolve(this)});
  }

  /**
   * Checks if data is loaded, and attempts to load it if it isn't (and if we have an api connection)
   * @param apiclient 
   */
  checkLoaded(apiclient: ApiclientService): void
  {
  }

  postProcess(): void
  {
    this.doPostProcess();  
  }

  /**
   * Override in children with any post processing work that needs doing
   */
  doPostProcess()
  {
  }

  /**
   * Return this object's segment of the URL
   * @returns
   */
  myPath(): string
  {
    return "";
  }

  /**
   * Return a full URL to this object, recursing through parents to build it
   * @returns 
   */
  path(): string
  {
    return (this._parent?.path() ?? "")+"/"+this.myPath();
  }

  postFixup(): void
  {
  }

  //do any necessary reinitialization after restore from saved data
  fixup(parent: dataStruct | undefined = undefined)
  {
    this._parent = parent;
    this.postFixup();
  }
}

//#endregion

//#region dataFolder

/**
 * A folder just for visual organization
 */
export class dataFolder extends dataStruct
{
  contents: dataStruct[] = Array();
  name: string;

  constructor(parent: dataStruct, name: string, members: dataStruct[] = [], icon: string = "folder")
  {
    super(parent);
    this.name = name;
    this.icon = icon;
    members.forEach(
      (member)=> {
        this.add(member);
      }
    );
  }

  /**
   * Skip directly to parent path
   * @returns 
   */
  override path(): string {
    return this._parent!.path();
  }

  override getName(): string
  {
    return this.name;
  }  

  override children(): dataStruct[]
  {
    return this.contents;
  }

  /**
   * add an item to this folder
   * @param struct 
   */
  add(struct: dataStruct): void
  {
    this.contents.push(struct);
  }
}

//#endregion

//#region topDataStruct

/**
 * a datastruct at the top level, responsible for loading and saving its contents
 */
export abstract class topDataStruct extends dataStruct
{
  data: {ref: dataDoc, type: any}[] = Array();
  dbData: {ref: dbData<any,any>, type: any}[] = Array();
  folders: dataFolder[] = Array();
  recDB: RecDB;

  constructor (parent: dataStruct, recDB: RecDB)
  {
    super (parent);
    this.recDB = recDB;
  }

  /**
   * Register a legacy data structure, which is held in memory permanently
   * @param typeref 
   * @returns 
   */
  register<T extends dataDoc>(typeref: { new(...args : any[]):T}): T
  {
    var struct = {ref: new typeref(this), type:typeref};
    this.data.push(struct);
    return struct.ref;
  }

  /**
   * Register a new-style data structure, which loads records on demand
   * @param typeref
   * @returns 
   */
  dbRegister<T extends dbData<any,any>>(typeref: { new(...args : any[]):T}): T
  {
    var struct = {ref: new typeref(this, this.recDB), type:typeref};
    this.dbData.push(struct);
    return struct.ref;
  }  

  addFolder(name: string, members: dataStruct[] = [], icon: string = 'folder')
  {
    this.folders.push(new dataFolder(this, name, members, icon));
  }

  override children(): dataStruct[]
  {
    return super.children().concat(this.folders);
  }   

  /**
   * Attempt to merge data from database into specified data structure
   * @param db 
   * @param target 
   * @param classtype 
   * @returns 
   */
  async load(db: IDBPDatabase<unknown>, target: dataDoc, classtype: any): Promise<any>
  {
    var doc: any = target as any;
    if (doc.dbkey == undefined)
    {
      throw new Error("Attempted to load into an object with no dbkey");
    }
    else
    {
      const value = await db.get('data', target.dbkey!);
      if (value != undefined) {
        //create a new object consisting of the revived data merged into the target
        //as we receive an object from indexedDB we stringify it and then parse it again with the reviver
        var newobj = _.merge(target, JSON.parse(JSON.stringify(value), Reviver.get(classtype)));
        //We can't replace an object reference by reference, so instead replace target keys with new object keys
        Object.keys(newobj).forEach(key => {
          doc[key] = newobj[key];
        });
      }
    }
  }

  override postFixup(): void {
    this.data.forEach((item)=>{item.ref.fixup(this)});
  }

  /**
   * Pulls in all data for legacy data structures
   * @param db 
   * @param recDB 
   * @returns 
   */
  loadAll(db: IDBPDatabase<unknown>, userData: UserdataService): Promise<any>[] {
    var entries: Promise<any>[] = new Array();
    this.data.forEach((item)=>{
      entries.push(this.load(db, item.ref, item.type))
    });
    return entries;
  }

  /**
   * Saves all data for legacy data structures
   * @param db 
   * @returns 
   */
  save(db: IDBPDatabase<unknown>): Promise<any>[]
  {
    var entries: Promise<any>[] = new Array();    
    this.data.forEach((item)=>{
      entries.push(this.saveObject(db, item.ref));
    });
    return entries;
  }

  /**
   * Export legacy data to a property in the specified object
   * @param obj 
   * @param name 
   */
  export(obj: any, name: string)
  {
    var exportObj: any = new Object();
    this.data.forEach((item)=>{
      console.dir(item.ref);
      var json = JSON.stringify(item.ref, jsonIgnoreReplacer);
      console.log(json);
      exportObj[item.ref.dbkey!] = JSON.parse(json);
    });
    obj[name] = exportObj;
  }


  /**
   * Save a dataDoc object to indexedDB
   * @param db 
   * @param object 
   * @returns 
   */
  saveObject(db: IDBPDatabase<unknown>, object: dataDoc): Promise<IDBValidKey>
  {
    //We need to ignore certain fields and strip class information so first we're JSONizing the dataDoc and then parsing it to 
    //get an instance of plain old Object
    var json = JSON.stringify(object, jsonIgnoreReplacer);
    return db.put('data', JSON.parse(json), object.dbkey);
  }
}

//#endregion

//#region dataDoc

/**
 * A datastruct that contains actual data
 */
export abstract class dataDoc extends dataStruct
{
  name: string;
  id: number;

  @jsonIgnore()
  dbkey?: string;

  @jsonIgnore()
  needsauth: boolean = false;

  constructor(parent: dataStruct, id: number, name: string)
  {
    super(parent);
    this.name = name;
    this.id = id;
  }

  override getName(): string
  {
    return this.name;
  }  

  override hasData(): boolean
  {
    return true;
  }  

  override async reload(apiclient: ApiclientService): Promise<apiDataDoc>
  {
    var ret = super.reload(apiclient);
    ret.then (
      (result) => {
        this.lastUpdate = new Date().getTime();
      }
    ) 
    return ret; 
  }

  override checkLoaded(apiclient: ApiclientService): void
  {
    this.isLoaded().then((res)=>{
      if (res && apiclient.isConnected())
      {
        this.reload(apiclient);
      }
    });
  }

  /**
   * @returns date of last update
   */
  getLastUpdate(): Date
  {
    return new Date(this.lastUpdate!);
  }

  /**
   * @returns true if data is loaded, otherwise false
   */
  isLoaded(): Promise<boolean>
  {
    return new Promise((resolve)=>{
      resolve (this.lastUpdate !== undefined);
    })
  }

  /**
   * @returns true if user authentication is required to call the api, otherwise false
   */
  isPrivate(): boolean
  {
    return this.needsauth;
  }

  /** Path segment defaults to the ID */
  override myPath(): string {
    return this.id.toString();
}  

  /**
   * Return an object containing the sanitized contents of this object 
   * Fields that might create circular references (for example, _parent) are removed.
   */
  debugFields(): object
  {
    var json = JSON.stringify(this, jsonIgnoreReplacer);
    return JSON.parse(json);
  }

}


//#endregion

//#region dataDetailDoc

//a numerically-indexed dataDoc designed for use in an array
export abstract class dataDetailDoc extends dataDoc implements apiIndexDoc
{
  constructor (parent: dataStruct, id: number, name: string)
  {
    super(parent, id, name);
  }

  override myPath(): string {
    return (this as any)[(this._parent as any).key];
  }

  //override in descendants if there's any additional data to retrieve
  async getExtraDetails(apiClient: ApiclientService): Promise<void>
  {  
  }

  override async reload(apiClient: ApiclientService): Promise<apiDataDoc>
  {
    return new Promise<apiDataDoc>((resolve)=>{
      (this._parent as dataDocDetailsCollection<any,any>).reloadItem(apiClient, (this as any)[(this._parent as any).key]).then(()=>{
        super.reload(apiClient).then((res)=>{
          resolve(res);
        });
      })
    })

  }

}

//#endregion

//#region dataDocCollection

/**
 * Class for an object containing an array of dataDocs that are updated as a single group
 */
export class dataDocCollection<T extends dataDoc> extends dataDoc
{
  items: T[] = new Array();
  @jsonIgnore()
  getItems?: Function;
  @jsonIgnore()
  itemsName: string = "unknown";
  @jsonIgnore()
  thisType?: Class;
  @jsonIgnore()
  key: string = "id"; //set to key to sort by
  @jsonIgnore()
  stringKey: boolean = false; //set to true if key is a string 

  constructor (parent: dataStruct, name: string)
  {
    super(parent,0,name);   
  }

  override doPostProcess(): void
  {
    var key = this.key;
    if (this.stringKey) 
    {
      this.items = this.items.sort(function(a:any, b:any){
        return ('' + a[key]).localeCompare(b[key]);
      });  
    }
    else
    {
      this.items = this.items.sort(function(a:any, b:any){return a[key] - b[key]});  
    }      
  }

  override async reload(apiclient: ApiclientService): Promise<apiDataDoc>
  {
    return new Promise((resolve)=>{
      this.getItems!(apiclient).then (
        (data: any) => {
          var json: string = JSON.stringify(data[this.itemsName]);
          const reviver = Reviver.get(this.thisType);
          const thisReviver = reviver['items'] as Reviver<T[]>;
          this.items = JSON.parse(json, thisReviver);
          this.postFixup();
          super.reload(apiclient).then((res)=>{
            resolve(res);
          })
        }
      );
    });
  }

  override postFixup(): void {
    this.items.forEach((item)=>{item.fixup(this)});
  }

  override myPath(): string {
    return this.itemsName.replaceAll('_','-');
  }
}

//#endregion

//#region dataDocDetailsCollection

/**
 * Class for a dataDocCollection that also maintains a set of individual details records
 */
export class dataDocDetailsCollection<T1 extends dataDoc,T2 extends dataDetailDoc> extends dataDocCollection<T1> implements IMasterDetail
{
  details: T2[] = new Array();
  getDetails?: Function;
  detailsType?: Class;

  @jsonIgnore()
  override id: number = 0;


  override postFixup(): void {
    super.postFixup();
    this.details.forEach((item)=>{item.fixup(this)});
  }

  checkItemLoaded(apiclient: ApiclientService, key: any)
  {
    if (!this.getDetailEntry(key)?.isLoaded() && apiclient.isConnected())
    {
      this.reloadItem(apiclient,key);
    }
  }

  async reloadItem(apiclient: ApiclientService, key: any): Promise<apiIndexDoc>
  {
    return new Promise((resolve)=>{
      this.getDetails!(apiclient, key).then (
        (data: any) => {
          var json: string = JSON.stringify(data);
          var entry = this.addDetailEntryFromJson(json, apiclient);
          entry.lastUpdate = new Date().getTime();
          resolve(entry);
        }
      );
    });
  }

  getAll(apiclient: ApiclientService, jobqueue: JobQueueService) {
    this.items.forEach(
      (item)=>{
        jobqueue.add( ()=>this.reloadItem(apiclient, (item as any)[this.key]) );
      }
    );
  }

  addDetailEntryFromJson(json: string, apiclient: ApiclientService): T2
  {
    const reviver = Reviver.get(this.detailsType);
    var item: T2 = JSON.parse(json, reviver);
    this.addDetailEntry(item);
    if (apiclient.isConnected())
    {
      item.getExtraDetails(apiclient);
    }
    return item;
  }

  ensureDetailEntry(apiClient: ApiclientService, key: any): T2 
  {
    var entry = this.getDetailEntry(key)
    if ( entry === undefined)
    {
      var json = JSON.stringify(
        {[this.key]:key}
      );       
      entry = this.addDetailEntryFromJson(json, apiClient);
    }
    return entry;
  }

  getDetailEntry(key: any): T2 | undefined
  {
    return this.details.find(
      (data, index, array)=>{
        return key === (data as any)[this.key];
      }
    )
  }

  hasDetailEntry(key: any): boolean
  {
    return this.getDetailEntry(key) !== undefined;
  }

  removeDetailEntry(key: any): void
  {
    this.details.forEach( (item, index) => {
      if ((item as any)[this.key] === key) this.details.splice(index,1);
    });
  }

  addDetailEntry(entry: T2): T2
  {
    var oldEntry = this.getDetailEntry((entry as any)[this.key]);
    if (oldEntry === undefined)
    {
      this.details.push(entry);
      entry.fixup(this);
      oldEntry = entry;
      this.sortDetails();
    }
    else
    {
      Object.keys(entry).forEach(key => {
        (oldEntry as any)[key] = (entry as any)[key];
      });
    }
    return oldEntry;
  }

  sortDetails(): void
  {
    var key = this.key;
    if (this.stringKey) 
    {
      this.details = this.details.sort(function(a:any, b:any){
        return ('' + a[key]).localeCompare(b[key]);
      });  
    }
    else
    {
      this.details = this.details.sort(function(a:any, b:any){return a[key] - b[key]});  
    }  
  }
}

//endregion

//region dbData

/**
 * alternative to dataDocDetailsCollection that uses recDB for storage
 * 
 * @template T1 - index type
 * @template T2 - detail type 
 * 
 * @description
 * T1 and T2 are usually provided as interfaces representing the API data structures.
 * 
 * Descendant classes are expected to set the following in their constructor:
 * type
 * indexProperty
 * icon
 * itemsName (used both as the "items" array property in the index and in the path )
 */
export abstract class dbData<T1 extends apiIndexDoc,T2 extends apiDataDoc> extends dataDoc implements IMasterDetail
{
  type: string = "items";
  itemsName: string = "items";
  needsAuth: boolean = false;
  title: string = "untitled";
  private: boolean = false;
  recDB: RecDB;
  key: string = "id";
  stringKey: boolean = false;
  //_index: WeakRef<T1>;
  //_items: WeakMap<{id: recID},T2>;

  constructor (parent: dataStruct, recDB: RecDB)
  {
    super(parent, 0, "");
    this.recDB = recDB;
    //this._index = new WeakRef(undefined as unknown as T1);
    //this._items = new WeakMap();
  }

  override reload(api: ApiclientService): Promise<T1> {
    return new Promise<T1>((resolve, reject)=>{
      this.getAPIIndex(api).then((res)=>{
        if (res !== undefined)
          resolve(res);
        else
          reject("API Error");
      })
    });
  }

  reloadItem(api: ApiclientService, key: any): Promise<T2> {
    return new Promise<T2>((resolve, reject)=>{
      this.getAPIRec(api, key).then((res)=>{
        if (res !== undefined)
          resolve(res);
        else
          reject("API Error");
      })
    });
  }

  override isLoaded(): Promise<boolean> {
    return new Promise<boolean>((resolve)=>{
      this.getDBIndex().then((res)=>{
        resolve(res?.lastUpdate !== undefined)
      });
    })
  }

  override isPrivate(): boolean {
    return this.private;
  }

  override hasData(): boolean {
      return true;
  }

  override getName(): string
  {
    return this.title;
  }

  /**
   * Get index for this type
   * @param userData 
   */
  getIndex(api: ApiclientService): Promise<T1 | undefined>
  {
    return new Promise<T1>((resolve, reject)=>{
      this.getDBIndex().then((result)=>{
        if (result === undefined)
        {
          //get from API and store in DB
          this.getAPIIndex(api)!.then((result)=>{
            if (result !== undefined)
            {
              result.lastUpdate = new Date().getTime();
              this.putDBIndex(result);
            }
            resolve(result!);
          })
        }
        else
        {
          //use the result from the DB
          resolve(result);
        }
      })
    })
  }

  /**
   * Get a record for this type, by ID
   * @param userData 
   */
  getRec(api: ApiclientService,id: recID): Promise<T2 | undefined>
  {
    return new Promise<T2>((resolve, reject)=>{
      this.getDBRec(id).then((result)=>{
        if (result === undefined)
        {
          //get from API and store in DB
          this.getAPIRec(api, id)!.then((result)=>{
            if (result !== undefined)
              this.putDBRec(id, result);
            resolve(result!);
          })
        }
        else
        {
          //use the result from the DB
          resolve(result);
        }
      })
    })
  }  

  

  /**
   * Get index directly from the database
   * @returns 
   */
  getDBIndex(): Promise<T1 | undefined>
  {
    return new Promise<T1 | undefined>((resolve)=>{
      this.recDB.get('index', this.type)?.then((data)=>{
        resolve(data?.data as T1);
      });
    });
  }

  /**
   * Get a record directly from the database, specified by ID
   * @param id 
   * @returns 
   */
  getDBRec(id:  recID): Promise<T2 | undefined>
  {
    return new Promise<T2| undefined>((resolve)=>{
      this.recDB.get(this.type, id)?.then((data)=>{
        resolve(data?.data as T2);
      });
    });
  }

  /**
   * Get all records of this type from the database
   * @returns 
   */
  getDBRecs(): Promise<T2[]>
  {
    return new Promise<T2[]>((resolve)=>{
      this.recDB.getAll(this.type)?.then((data)=>{
        resolve(data.map((data)=>data.data) as T2[]);
      });
    });    
  }

  /**
   * Put a record into the database, overwriting the same ID if present
   * @param id
   * @param rec 
   * @returns 
   */
  putDBRec(id: recID, rec: T2): Promise<IDBValidKey>
  {
    return this.recDB.add(this.type, id, rec as object);
  }

  /**
   * Put index into the database, overwriting existing if present
   * @param rec
   * @returns 
   */
  putDBIndex(rec: T1): Promise<IDBValidKey>
  {
    return this.recDB.add('index', this.type, rec as object);
  }  

  /**
   * Override in descendants to pull the index from the API
   */
  abstract getAPIIndex(api: ApiclientService): Promise<T1 | undefined>;

  /**
   * Override in descendants to pull a record from the API
   * @param id 
   */
  abstract getAPIRec(api: ApiclientService, id:  recID): Promise<T2 | undefined>;  

  /**
   * @inheritdoc 
   */
  override myPath(): string {
    return this.itemsName.replaceAll('_','-');
  }
}

//#endregion


//#region Common Interfaces

export interface IMasterDetail
{
  reload(api: ApiclientService): Promise<apiIndexDoc>;
  reloadItem(api: ApiclientService, key: any): Promise<apiDataDoc>;
  _parent?: dataStruct;
  path(): string;
  getName(): string;
  hasData(): boolean;
  key: string;
  stringKey: boolean;
  checkLoaded(api: ApiclientService): void;
  getLastUpdate(): Date;
  isLoaded(): Promise<boolean>;
}

export interface apiIndexDoc extends apiDataDoc
{
}

export interface apiDataDoc
{
  lastUpdate: number | undefined;
}

export interface mediaDataStruct
{
  _links: linksStruct;
  assets: assetStruct[];
  id: number;
}

export interface genderStruct
{
  type: string;
  name: string;
}

export interface factionStruct
{
  type: string;
  name: string;
}

export interface realmStruct
{
  id: number;
  name: string;
  key: keyStruct;
  slug: string;
}

export interface keyStruct
{
  href: string;   
}

export interface hrefStruct
{
  href: string;
}

export interface linksStruct
{
  self: hrefStruct;
}

export interface mediaStruct
{
  key: keyStruct;
  id: number;
}

export interface assetStruct
{
  key: string;
  value: string;
  file_data_id: number;
}

export interface moneyStruct
{
  value: number;
  units: {
    gold: number;
    silver: number;
    copper: number;
  }
}

export interface idNameStruct
{
  id: number;
  name: string;
}

export interface refStruct
{
  id: number;
  name: string;
  key: keyStruct;
}

//#endregion