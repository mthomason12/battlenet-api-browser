import { ApiclientService } from '../apiclient/apiclient.service';
import { jsonIgnore } from 'json-ignore';
import _, { now } from 'lodash';

export abstract class dataStruct {
  @jsonIgnore()
  _parent?: dataStruct;
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

/**
 * A folder just for visual organization
 */
export class dataFolder extends dataStruct
{
  contents: dataStruct[] = Array();
  name: string;

  constructor(parent: dataStruct, name: string)
  {
    super(parent);
    this.name = name;
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


export abstract class dataDoc extends dataStruct
{
  name: string;

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