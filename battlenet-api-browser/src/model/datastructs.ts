import { IDBPDatabase } from 'idb';
import { ApiclientService } from '../apiclient/apiclient.service';
import { jsonIgnore, jsonIgnoreReplacer } from 'json-ignore';
import _ from 'lodash';
import { Reviver } from '@badcafe/jsonizer';

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
  async reload(_apiclient: ApiclientService)
  {
    this.postProcess();
  }

  /**
   * Checks if data is loaded, and attempts to load it if it isn't (and if we have an api connection)
   * @param apiclient 
   */
  checkLoaded(apiclient: ApiclientService)
  {
  }

  postProcess()
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

  postFixup()
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

  constructor(parent: dataStruct, name: string, folder: string = "folder")
  {
    super(parent);
    this.name = name;
    this.icon = folder;
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
  add(struct: dataStruct)
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

  abstract loadAll(db: IDBPDatabase<unknown>): Promise<any>[];

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

  /**
   * Override in descendant classes to save this object's contents (usually by calling saveObject on each item)
   * @param db 
   */
  abstract save(db: IDBPDatabase<unknown>): void;

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

  @jsonIgnore()
  dbkey?: string;

  @jsonIgnore()
  needsauth: boolean = false;

  lastupdate: number | undefined;

  constructor(parent: dataStruct, name: string)
  {
    super(parent);
    this.name = name;
  }

  override getName(): string
  {
    return this.name;
  }  

  override hasData(): boolean
  {
    return true;
  }  

  override async reload(apiclient: ApiclientService)
  {
    super.reload(apiclient).then (
      () => {this.lastupdate = new Date().getTime()}
    )
  }

  override checkLoaded(apiclient: ApiclientService)
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

}

//#endregion

//#region dataDocCollection

export class dataDocCollection<T extends dataDoc> extends dataDoc
{
  items: T[] = new Array();

  constructor (parent: dataStruct, name: string)
  {
    super(parent,name);   
  }

  override doPostProcess()
  {
    this.items = this.items.sort(function(a:any, b:any){return a.id - b.id});    
  }

  override postFixup(): void {
    this.items.forEach((item)=>{item.fixup(this)});
  }
}

//#endregion

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

export interface refStruct
{
  id: number;
  name: string;
  key: keyStruct;
}