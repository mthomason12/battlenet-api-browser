import { last } from 'lodash';
import { RecDB, recID } from '../lib/recdb';
import { apiClientService } from '../services/apiclient.service';
import { JobQueueService } from '../services/jobqueue.service';
import { dataDoc, dataStruct, IApiDataDoc, INamedItem, IApiIndexDoc, IIndexItem, dbDataIndex, apiSearchResponse } from './datastructs';

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

export abstract class dbData<T1 extends IApiIndexDoc, T2 extends IApiDataDoc> extends dataDoc implements IMasterDetail {
  type: string = "items";
  /** the property of T1 that is an array of index items */
  itemsName: string = "items";
  override needsAuth: boolean = false;
  title: string = "untitled";
  private: boolean = false;
  recDB: RecDB;
  hideKey: boolean = false;
  key: string = "id";
  stringKey: boolean = false;
  protected isSearchable = false;
  protected indexRebuildable = false;
  indexCache?: WeakRef<T1>; //cached copy of the index doc
  //if crossLink is true, clicking an index item takes us to another record type rather than to this type's detail form
  crossLink: boolean = false;
  recKeys: recID[] = new Array();
  //_index: WeakRef<T1>;
  //_items: WeakMap<{id: recID},T2>;

  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, 0, "");
    this.recDB = recDB;
    this.isReloadable = true;
    //this._index = new WeakRef(undefined as unknown as T1);
    //this._items = new WeakMap();
  }

  override reload(api: apiClientService): Promise<T1> {
    return new Promise<T1>((resolve, reject) => {
      this.getAPIIndex(api).then((res) => {
        if (res !== undefined) {
          res.lastUpdate = new Date().getTime();
          this.putDBIndex(res);
          resolve(res);
        }

        else
          reject("API Error");
      });
    });
  }

  reloadItem(api: apiClientService, key: any): Promise<T2> {
    return new Promise<T2>((resolve, reject) => {
      this.getAPIRec(api, key).then((res) => {
        if (res !== undefined) {
          res.lastUpdate = new Date().getTime();
          //get anything extra that's needed
          this.getAPIExtra(api, res).then(() => {
            this.putDBRec(key, res);
            resolve(res!);
          });
        }

        else
          reject("API Error");
      });
    });
  }

  override isLoaded(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getDBIndex().then((res) => {
        resolve(res?.lastUpdate !== undefined);
      });
    });
  }

  isItemLoaded(id: recID): boolean {
    return this.recKeys.includes(id);
  }

  override isPrivate(): boolean {
    return this.private;
  }

  override hasData(): boolean {
    return true;
  }

  hasSearch(): boolean {
    return this.isSearchable;
  }

  canRebuildIndex(): boolean {
    return this.indexRebuildable;
  }

  override getName(): string {
    return this.title;
  }

  /**
   * Get name from index doc
   * @param rec
   * @returns
   */
  getRecName(rec: IApiDataDoc): string {
    return (rec as any).name;
  }

  /** translate index into array of IIndexItem */
  getIndexItems(idx: IApiIndexDoc): IIndexItem[] {
    var index = ((idx as any)[this.itemsName] as Array<IIndexItem>)
      .map((value, index, array) => { return this.mutateIndexItem(value); });
    index = index.sort((a, b) => { return this.indexCompare(a, b); });
    return index;
  }


  indexCompare(a: any, b: any) {
    var key: string = this.key;
    if (this.stringKey)
      return ('' + a[key]).localeCompare(b[key]);

    else
      return a[key] - b[key];
  }

  /**
   * Override in descendants that have their indexRebuildable set to true;
   */
  rebuildIndex(): void {}

  /**
   * Override in descendants to apply any necessary mutation to the index item
   * @param item
   * @returns
   */
  mutateIndexItem(item: IIndexItem): IIndexItem {
    return item;
  }

  getIndexItemPath(item: IIndexItem): string {
    return this.path() + "/" + (item as any)[this.key];
  }

  getIndexItemName(item: IIndexItem): string {
    return item.name;
  }

  /**
   * Get index for this type
   * @param userData
   */
  getIndex(api: apiClientService): Promise<T1 | undefined> {
    return new Promise<T1>((resolve, reject) => {
      //fill the recKeys array
      this.getDBRecKeys().then((array) => {
        this.recKeys = array;
      });
      //use cached index if available
      var idx = this.indexCache?.deref();
      if (idx) {
        resolve (idx);
      }
      else
      {
        this.getDBIndex().then((result) => {
          if (result === undefined) {
            this.reload(api).then((apiResult)=>{
              this.indexCache = new WeakRef(apiResult);
              resolve(apiResult);
            })
          }
          else {
            //use the result from the DB
            this.indexCache = new WeakRef(result);
            resolve(result);
          }
        });
      };
    });
  }

  /**
   * Get a record for this type, by ID
   * @param userData
   */
  getRec(api: apiClientService, id: recID): Promise<T2 | undefined> {
    return new Promise<T2>((resolve, reject) => {
      this.getDBRec(id).then((result) => {
        if (result === undefined) {
          //get from API and store in DB
          resolve(this.reloadItem(api, id));
        }

        else {
          //use the result from the DB
          resolve(result);
        }
      });
    });
  }

  canGetAllRecs(): boolean {
    return true;
  }

  getAllRecs(api: apiClientService, jobqueue: JobQueueService): Promise<void> {
    return new Promise<void>((resolve) => {
      this.getIndex(api).then((idx) => {
        this.getIndexItems(idx!).forEach((item) => {
          jobqueue.add(() => this.getRec(api, (item as any)[this.key]));
        });
        resolve();
      });
    });
  }

  /**
   * Get index directly from the database
   * @returns
   */
  getDBIndex(): Promise<T1 | undefined> {
    return new Promise<T1 | undefined>((resolve) => {
      this.recDB.get('index', this.type)?.then((data) => {
        resolve(data?.data as T1);
      });
    });
  }

  /**
   * Get a record directly from the database, specified by ID
   * @param id
   * @returns
   */
  getDBRec(id: recID): Promise<T2 | undefined> {
    return new Promise<T2 | undefined>((resolve) => {
      this.recDB.get(this.type, id)?.then((data) => {
        resolve(data?.data as T2);
      });
    });
  }

  clear(): Promise<void>
  {
    return this.recDB.clear(this.type);
  }

  /**
   * Get all records of this type from the database
   * @returns
   */
  getDBRecs(): Promise<T2[]> {
    return new Promise<T2[]>((resolve) => {
      this.recDB.getAll(this.type)?.then((data) => {
        resolve(data.map((data) => data.data) as T2[]);
      });
    });
  }

  /**
   * Get primary key of all records of this type
   * @returns
   */
  getDBRecKeys(): Promise<recID[]> {
    return this.recDB.getKeys(this.type);
  }

  /**
   * Put a record into the database, overwriting the same ID if present
   * @param id
   * @param rec
   * @returns
   */
  putDBRec(id: recID, rec: T2): Promise<IDBValidKey> {
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
  putDBIndex(rec: T1): Promise<IDBValidKey> {
    //update cache
    this.indexCache = new WeakRef(rec);
    //save to database
    return this.recDB.add('index', this.type, rec as object);
  }

  /**
   * Override in descendants to pull the index from the API
   */
  abstract getAPIIndex(api: apiClientService): Promise<T1 | undefined>;

  /**
   * Override in descendants to pull a record from the API
   * @param id
   */
  abstract getAPIRec(api: apiClientService, id: recID): Promise<T2 | undefined>;

  /**
   * Override in descendants if there's anything else to be fetched and attached to the api data record
   * @param apiClient
   * @param apiRec
   * @returns
   */
  getAPIExtra(apiClient: apiClientService, apiRec: T2): Promise<void> {
    return new Promise((resolve) => { resolve(); });
  }

  /**
   * Override in subclasses that can search
   * @param api 
   * @param searchParams 
   */
  getSearch(api: apiClientService, searchParams:string): Promise<IApiDataDoc[] | undefined> {
    return Promise.reject();
  }

  /**
   * Override in subclasses that can add index items
   * @param items
   */
  addIndexItems(items: IApiDataDoc[]): Promise<void>
  {
    return Promise.resolve();
  }

  /**
   * @inheritdoc
   */
  override myPath(): string {
    return this.itemsName.replaceAll('_', '-');
  }

  /**
   * Export all child data as an object
   */
  export(): Promise<object> {
    return new Promise((resolve) => {
      var ob: any = {};
      var promises = [];
      promises.push(this.getDBIndex().then((idx) => {
        ob.index = idx;
      }));
      promises.push(this.getDBRecs().then((recs) => {
        ob.items = recs;
      }));
      Promise.allSettled(promises).then(() => {
        console.log("Exporting" + this.getName());
        resolve(ob);
      });
    });
  }
}
//#endregion
//region dbDataIndexOnly


/**
 * dbData variant that *only* has an index, no records
 */
export abstract class dbDataIndexOnly<T extends IApiIndexDoc> extends dbData<T, any> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.crossLink = true;
  }

  //these functions shouldn't ever get called
  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<IApiDataDoc> {
    throw new Error("dbDataIndexOnly unsupported function");
  };

  override getRec(api: apiClientService, id: recID): Promise<any> {
    throw new Error("dbDataIndexOnly unsupported function");
  }

  override getDBRec(id: recID): Promise<any> {
    throw new Error("dbDataIndexOnly unsupported function");
  }

  override getDBRecs(): Promise<any[]> {
    throw new Error("dbDataIndexOnly unsupported function");
  }

  override getDBRecKeys(): Promise<recID[]> {
    return Promise.resolve([]);
  }

  override putDBRec(id: recID, rec: any): Promise<IDBValidKey> {
    throw new Error("dbDataIndexOnly unsupported function");
  }
}

//region dbDataNoIndex

/**
 * dbData variant that has no downloadable index, and has to maintain its own
 * from the available records.
 * 
 * It is implied that a search function is available to find these records, and that
 * addIndexItems will be called to add selected results.
 *
 * T1 is the "index" record returned from searching
 * T2 is the full data record
 */
export abstract class dbDataNoIndex<T1 extends IApiDataDoc, T2 extends IApiDataDoc> extends dbData<dbDataIndex<T1>, T2> {

  searchItems = "items";

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
    this.itemsName = "items";
    this.isSearchable = true;
    this.isReloadable = false;
  }


  /**
   * By ensuring we return an empty index if we can't find one, we should ensure
   * getAPIIndex is never called.
   */
  override getDBIndex(): Promise<dbDataIndex<T1>> {
    return new Promise((resolve, reject)=>{
      super.getDBIndex().then ((idx)=>{
        if (idx) {
          resolve(idx);
        } else {
          resolve (this.emptyIndex());
        }
      })
    })
  }

  /**
   * In theory, this should never be called, because getDBIndex will always return something
   * @param api
   */
  override getAPIIndex(api: apiClientService): Promise<undefined> {
    throw new Error("dbDataIndexOnly unsupported function");
  }

  /**
   * There is nothing to reload.  Throw an error if we got this far so we can trace how we got there.
   * @param api 
   * @returns 
   */
  override reload(api: apiClientService): Promise<dbDataIndex<T1>> {
    throw new Error("dbDataIndexOnly unsupported function");
  }

  /**
   * Perform a search using the provided API call
   * @param api 
   * @param searchParams 
   * @returns 
   */
  override getSearch(api: apiClientService, searchParams:string): Promise<T1[] | undefined>
  {
    return new Promise((resolve)=>{
      this.getAPISearch(api, searchParams, {}).then((result)=>{
        resolve(this.postProcessSearchResults(result?.results!));
      })
    })
  }

  postProcessSearchResults(results: T1[]): T1[] {
    return results;
  }

  /**
   * Add items to the index
   * @param items 
   */
  override addIndexItems(items: T1[]): Promise<void> {
    return new Promise((resolve)=>{
      //we don't need to bother with getIndex or getAPIIndex, just go straight to the DB
      this.getDBIndex().then((idx)=>{
        //add the new items to the index
        items.forEach((item)=>{
          //prevent duplicates
          if (!idx.items.find((value)=>{ return value.id == item.id}))
            idx.items.push(item);
        });
        //save the index
        this.putDBIndex(idx).then(()=>{
          resolve();
        });
      });
    });
  }

  emptyIndex(): dbDataIndex<T1> {
    return {
      items: [],
      lastUpdate: Date.now()
    }
  }

  abstract getAPISearch(api: apiClientService, searchParams: string, params: object): Promise<apiSearchResponse<T1> | undefined>;

}


//region Interfaces

export interface IMasterDetail extends IApiDataDoc, INamedItem
{
  reload(api: apiClientService): Promise<IApiIndexDoc>;
  reloadItem(api: apiClientService, key: any): Promise<IApiDataDoc>;
  _parent?: dataStruct;
  path(): string;
  crossLink: boolean;
  clear(): Promise<void>;
  canGetAllRecs(): boolean;
  canReload(): boolean;
  canRebuildIndex(): boolean;
  getIndex(api: apiClientService): Promise<IApiIndexDoc | undefined>
  getIndexItems(idx: IApiIndexDoc): IIndexItem[];
  getIndexItemPath(item: IIndexItem): string;
  getIndexItemName(item: IIndexItem): string;
  getRec(api: apiClientService,id: recID): Promise<IApiIndexDoc | undefined>;
  getAllRecs(api: apiClientService, queue: JobQueueService): Promise<void>;
  getRecName(rec: IApiDataDoc): string;
  getSearch(api: apiClientService, searchParams:string): Promise<IApiDataDoc[] | undefined>;
  addIndexItems(items: IApiDataDoc[]): Promise<void>;
  rebuildIndex(): void;
  hasData(): boolean;
  hasSearch(): boolean;
  key: string;
  hideKey: boolean;
  stringKey: boolean;
  checkLoaded(api: apiClientService): void;
  getLastUpdate(idx: IApiIndexDoc): Date;
  isLoaded(): Promise<boolean>;
  export(): Promise<object>;
  isItemLoaded(id: recID): boolean;  
}




