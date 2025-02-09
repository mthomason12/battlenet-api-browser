import { RecDB, recID } from '../lib/recdb';
import { apiClientService } from '../services/apiclient.service';
import { JobQueueService } from '../services/jobqueue.service';
import { dataDoc, dataStruct, apiDataDoc, INamedItem } from './datastructs';

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

export abstract class dbData<T1 extends apiIndexDoc, T2 extends apiDataDoc> extends dataDoc implements IMasterDetail {
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
  //if crossLink is true, clicking an index item takes us to another record type rather than to this type's detail form
  crossLink: boolean = false;
  recKeys: recID[] = new Array();
  //_index: WeakRef<T1>;
  //_items: WeakMap<{id: recID},T2>;
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, 0, "");
    this.recDB = recDB;
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

  override getName(): string {
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
      this.getDBIndex().then((result) => {
        if (result === undefined) {
          resolve(this.reload(api));
        }

        else {
          //use the result from the DB
          resolve(result);
        }
      });
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

export abstract class dbDataIndexOnly<T extends apiIndexDoc> extends dbData<T, any> {
  constructor(parent: dataStruct, recDB: RecDB) {
    super(parent, recDB);
    this.crossLink = true;
  }

  //these functions shouldn't ever get called
  override getAPIRec = function (apiClient: apiClientService, id: number): Promise<apiDataDoc> {
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
/**
 * dbData variant that has no downloadable index, and has to maintain its own
 * from the available records.
 * It is implied that a search function is available
 */

export abstract class dbDataNoIndex<T extends apiDataDoc> extends dbData<any, T> {

  override getIndex(api: apiClientService): Promise<any> {
    throw new Error("dbDataNoIndex unsupported function");
  }

  override getDBIndex(): Promise<any> {
    throw new Error("dbDataNoIndex unsupported function");
  }

  abstract search(api: apiClientService, params: object): Promise<T | undefined>;

}


//region Interfaces

export interface IMasterDetail extends apiDataDoc, INamedItem
{
  reload(api: apiClientService): Promise<apiIndexDoc>;
  reloadItem(api: apiClientService, key: any): Promise<apiDataDoc>;
  _parent?: dataStruct;
  path(): string;
  crossLink: boolean;
  getIndex(api: apiClientService): Promise<apiIndexDoc | undefined>
  getIndexItems(idx: apiIndexDoc): IIndexItem[];
  getIndexItemPath(item: IIndexItem): string;
  getIndexItemName(item: IIndexItem): string;
  getRec(api: apiClientService,id: recID): Promise<apiIndexDoc | undefined>;
  getAllRecs(api: apiClientService, queue: JobQueueService): Promise<void>;
  getRecName(rec: apiDataDoc): string;
  hasData(): boolean;
  key: string;
  hideKey: boolean;
  stringKey: boolean;
  checkLoaded(api: apiClientService): void;
  getLastUpdate(idx: apiIndexDoc): Date;
  isLoaded(): Promise<boolean>;
  export(): Promise<object>;
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


