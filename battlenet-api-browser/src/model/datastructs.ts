import { apiClientService } from '../services/apiclient.service';
import { jsonIgnore, jsonIgnoreReplacer } from 'json-ignore';
import _, {} from 'lodash';
import { RecDB, recID } from '../lib/recdb';
import { dbData } from './dbdatastructs';


//#region dataStruct

/**
 * A generic data structure
 */
export abstract class dataStruct implements IApiDataDoc, INamedItem {
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
  async reload(_apiclient: apiClientService): Promise<IApiDataDoc>
  {
    this.postProcess();
    return new Promise((resolve)=>{resolve(this)});
  }

  /**
   * Checks if data is loaded, and attempts to load it if it isn't (and if we have an api connection)
   * @param apiclient 
   */
  checkLoaded(apiclient: apiClientService): Promise<void>
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

  export(): Promise<object> {
    return new Promise((resolve)=>{
      var exportOb: any = {};
      var promises: Promise<any>[] = [];
      this.dbData.forEach((data)=>{
        var dataref = data.ref as any as dbData<any,any>;
        promises.push(new Promise<void>((resolveInner)=>{
          dataref.export().then((ob)=>{
            exportOb[dataref.getName()] = ob;
            resolveInner();
          });
        }));  
      });
      Promise.allSettled(promises).then(()=>{
        resolve(exportOb);        
      });
    });
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
  needsAuth: boolean = false;

  @jsonIgnore()
  isReloadable: boolean = false;

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

  override async reload(apiclient: apiClientService): Promise<IApiDataDoc>
  {
    var ret = super.reload(apiclient);
    ret.then (
      (result) => {
        this.lastUpdate = new Date().getTime();
      }
    ) 
    return ret; 
  }

  canReload(): boolean {
    return this.isReloadable;
  }

  override checkLoaded(apiclient: apiClientService): Promise<void>
  {
    return new Promise((resolve)=>{
      this.isLoaded().then((res)=>{
        if (res && apiclient.isConnected() && this.canReload())
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
    return this.needsAuth;
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

//endregion

//region Common Interfaces

export interface IIndexItem
{
  id: recID;
  name: string;
}

export interface IApiIndexDoc extends IApiDataDoc
{
}

export interface dbDataIndex<T> extends IApiIndexDoc
{
  items: T[];
}

export interface apiSearchResponse<T> 
{
  page: number;
  pageSize: number;
  maxPageSize: number;
  pageCount: number;
  results: T[];
}

export interface INamedItem 
{
  getName(): string;
}

export interface IApiDataDoc
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

export interface regionedNameStruct  {
  it_IT?: string,
  ru_RU?: string,
  en_GB?: string,
  zh_TW?: string,
  ko_KR?: string,
  en_US?: string,
  es_MX?: string,
  pt_BR?: string,
  es_ES?: string,
  zh_CN?: string,
  fr_FR?: string,
  de_DE?: string
}

export interface weaponStruct {
  damage: {
    min_value: number,
    max_value: number,
    display_string: string,
    damage_class: {
      type: string,
      name: string
    }
  },
  attack_speed: {
    value: number,
    display_string: string,
  },
  dps: {
    value: number,
    display_string: string,
  }
}

export interface itemStatStruct {
  type: {
    type: string,
    name: string
  },
  value: number,
  is_negated: boolean,
  display: {
    display_string: string,
    color: rgbaColorStruct,
  }
}

export type itemStatsStruct = itemStatStruct[];

export interface rgbaColorStruct {
  r: number,
  g: number,
  b: number,
  a: number
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