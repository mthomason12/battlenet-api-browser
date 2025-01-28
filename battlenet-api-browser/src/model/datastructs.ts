import { IDBPDatabase } from 'idb';
import { ApiclientService } from '../services/apiclient.service';
import { jsonIgnore, jsonIgnoreReplacer } from 'json-ignore';
import _ from 'lodash';
import { Class, Reviver } from '@badcafe/jsonizer';

//#region dataStruct

/**
 * A generic data structure
 */
export abstract class dataStruct {
  @jsonIgnore()
  _parent?: dataStruct;
  @jsonIgnore()
  icon: string = "";

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
  async reload(_apiclient: ApiclientService): Promise<void>
  {
    this.postProcess();
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

  myPath(): string
  {
    return "";
  }

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

  folders: dataFolder[] = Array();

  register<T extends dataDoc>(typeref: { new(...args : any[]):T}): T
  {
    var struct = {ref: new typeref(this), type:typeref};
    this.data.push(struct);
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

  loadAll(db: IDBPDatabase<unknown>): Promise<any>[] {
    var entries: Promise<any>[] = new Array();
    this.data.forEach((item)=>{
      entries.push(this.load(db, item.ref, item.type))
    });
    return entries;
  }

  save(db: IDBPDatabase<unknown>)
  {
    this.data.forEach((item)=>{
      this.saveObject(db, item.ref);
    });
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

  lastupdate: number | undefined;

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

  override async reload(apiclient: ApiclientService): Promise<void>
  {
    super.reload(apiclient).then (
      () => {this.lastupdate = new Date().getTime()}
    )
  }

  override checkLoaded(apiclient: ApiclientService): void
  {
    if (!this.isLoaded() && apiclient.isConnected())
    {
      this.reload(apiclient);
    }
  }

  /**
   * @returns date of last update
   */
  getLastUpdate(): Date
  {
    return new Date(this.lastupdate!);
  }

  /**
   * @returns true if data is loaded, otherwise false
   */
  isLoaded(): boolean
  {
    return (this.lastupdate !== undefined);
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
export abstract class dataDetailDoc extends dataDoc
{

  constructor (parent: dataStruct, id: number, name: string)
  {
    super(parent, id, name);
  }

  override myPath(): string {
    console.dir(this);
    return (this as any)[(this._parent as any).key];
  }

  //override in descendants if there's any additional data to retrieve
  async getExtraDetails(apiClient: ApiclientService): Promise<void>
  {  
  }

  override async reload(apiClient: ApiclientService)
  {
    (this._parent as any).reloadItem(apiClient, (this as any)[(this._parent as any).key]).then(()=>{
      super.reload(apiClient);
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

  override async reload(apiclient: ApiclientService)
  {
    this.getItems!(apiclient).then (
      (data: any) => {
        var json: string = JSON.stringify(data[this.itemsName]);
        const reviver = Reviver.get(this.thisType);
        const thisReviver = reviver['items'] as Reviver<T[]>;
        this.items = JSON.parse(json, thisReviver);
        this.postFixup();
        super.reload(apiclient);
      }
    );
  }

  override postFixup(): void {
    console.dir(this.items);
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
export class dataDocDetailsCollection<T1 extends dataDoc,T2 extends dataDetailDoc> extends dataDocCollection<T1>
{
  details: T2[] = new Array();
  getDetails?: Function;
  detailsType?: Class;


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

  async reloadItem(apiclient: ApiclientService, key: any)
  {
    this.getDetails!(apiclient, key).then (
      (data: any) => {
        var json: string = JSON.stringify(data);
        var entry = this.addDetailEntryFromJson(json, apiclient);
        entry.lastupdate = new Date().getTime();
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

//#endregion

//#region Common Interfaces

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

export interface refStruct
{
  id: number;
  name: string;
  key: keyStruct;
}

//#endregion