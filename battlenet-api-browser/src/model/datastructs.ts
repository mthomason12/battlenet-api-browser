import { ApiclientService } from '../services/apiclient.service';
import { jsonIgnore, jsonIgnoreReplacer } from 'json-ignore';
import _, {} from 'lodash';
import { JobQueueService } from '../services/jobqueue.service';
import { RecDB, recID } from '../lib/recdb';


//#region dataStruct

/**
 * A generic data structure
 */
export abstract class dataStruct implements apiDataDoc, INamedItem {
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
  checkLoaded(apiclient: ApiclientService): Promise<void>
  {
    //default is just to resolve immediately
    return new Promise((resolve)=>{ resolve(); })
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
  dbData: {ref: dbData<any,any>, type: any}[] = Array();
  folders: dataFolder[] = Array();
  recDB: RecDB;

  constructor (parent: dataStruct, recDB: RecDB)
  {
    super (parent);
    this.recDB = recDB;
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

  override postFixup(): void {
    this.dbData.forEach((item)=>{item.ref.fixup(this)});
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

  public get loaded() : boolean {
    return this.lastUpdate !== undefined;
  }
  

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

  override checkLoaded(apiclient: ApiclientService): Promise<void>
  {
    return new Promise((resolve)=>{
      this.isLoaded().then((res)=>{
        if (res && apiclient.isConnected())
        {
          this.reload(apiclient).then(()=>{
            resolve();
          })
        }
      });
      resolve();
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


//region dbData

/**
 * dataDoc with an index and child data objects stored in recDB
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
  /** the property of T1 that is an array of index items */
  itemsName: string = "items"; 
  needsAuth: boolean = false;
  title: string = "untitled";
  private: boolean = false;
  recDB: RecDB;
  hideKey: boolean = false;
  key: string = "id";
  stringKey: boolean = false;
  recKeys: recID[] = new Array();
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

  isItemLoaded(id: recID): boolean
  {
    return this.recKeys.includes(id);
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
   * Get name from index doc
   * @param rec
   * @returns 
   */
  getRecName(rec: apiDataDoc): string {
    return (rec as any).name;
  }

  /** translate index into array of IIndexItem */
  getIndexItems(idx: apiIndexDoc): IIndexItem[] {
    var index = ((idx as any)[this.itemsName] as Array<IIndexItem>)
      .map((value, index, array)=>{ return this.mutateIndexItem(value);});
    index = index.sort((a,b)=>{return this.indexCompare(a,b)});
    return index;
  }

  indexCompare(a: any, b: any)
  {
    var key: string = this.key;
    if (this.stringKey) 
      return ('' + a[key]).localeCompare(b[key]); 
    else
      return a[key] - b[key];
  }

  /**
   * Override in descendants to apply any necessary mutation to the index item
   * @param item 
   * @returns 
   */
  mutateIndexItem(item: IIndexItem): IIndexItem {
    return item;
  }

  getIndexItemPath(item: IIndexItem): string
  {
    return this.path()+"/"+(item as any)[this.key];
  }

  getIndexItemName(item: IIndexItem): string
  {
    return item.name;
  }

  /**
   * Get index for this type
   * @param userData 
   */
  getIndex(api: ApiclientService): Promise<T1 | undefined>
  {
    return new Promise<T1>((resolve, reject)=>{
      //fill the recKeys array
      this.getDBRecKeys().then((array)=>{
        this.recKeys = array;
      })
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
            {
              result.lastUpdate = new Date().getTime();              
              //get anything extra that's needed
              this.getAPIExtra(api, result).then (()=>{
                this.putDBRec(id, result);
              })              
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

  getAllRecs(api: ApiclientService, jobqueue: JobQueueService): Promise<void> {
    return new Promise<void>((resolve)=>{
      this.getIndex(api).then((idx)=>{
        this.getIndexItems(idx!).forEach((item)=>{
          jobqueue.add( ()=> this.getRec(api, (item as any)[this.key]) );
        });
        resolve();
      });
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
   * Get primary key of all records of this type
   * @returns 
   */
  getDBRecKeys(): Promise<recID[]>
  {
    return this.recDB.getKeys(this.type);
  }

  /**
   * Put a record into the database, overwriting the same ID if present
   * @param id
   * @param rec 
   * @returns 
   */
  putDBRec(id: recID, rec: T2): Promise<IDBValidKey>
  {
    //add key to our list of valid keys
    if (!this.recKeys.includes(id))
      this.recKeys.push(id);
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
   * Override in descendants if there's anything else to be fetched and attached to the api data record
   * @param apiClient 
   * @param apiRec 
   * @returns 
   */
  getAPIExtra(apiClient: ApiclientService, apiRec: T2): Promise<void> 
  {
    return new Promise((resolve)=>{resolve();});
  }

  /**
   * @inheritdoc 
   */
  override myPath(): string {
    return this.itemsName.replaceAll('_','-');
  }
}

//#endregion


//#region Common Interfaces

export interface INamedItem 
{
  getName(): string;
}

export interface IMasterDetail extends apiDataDoc, INamedItem
{
  reload(api: ApiclientService): Promise<apiIndexDoc>;
  reloadItem(api: ApiclientService, key: any): Promise<apiDataDoc>;
  _parent?: dataStruct;
  path(): string;
  getIndex(api: ApiclientService): Promise<apiIndexDoc | undefined>
  getIndexItems(idx: apiIndexDoc): IIndexItem[];
  getIndexItemPath(item: IIndexItem): string;
  getIndexItemName(item: IIndexItem): string;
  getRec(api: ApiclientService,id: recID): Promise<apiIndexDoc | undefined>;
  getAllRecs(api: ApiclientService, queue: JobQueueService): Promise<void>;
  getRecName(rec: apiDataDoc): string;
  hasData(): boolean;
  key: string;
  hideKey: boolean;
  stringKey: boolean;
  checkLoaded(api: ApiclientService): void;
  getLastUpdate(idx: apiIndexDoc): Date;
  isLoaded(): Promise<boolean>;
  isItemLoaded(id: recID): boolean;  
}

export interface IIndexItem
{
  id: recID;
  name: string;
}

export interface apiIndexDoc extends apiDataDoc
{
}

export interface apiDataDoc
{
  id?: recID;
  name?: string;
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