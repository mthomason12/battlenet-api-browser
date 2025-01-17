import { ApiclientService } from '../apiclient/apiclient.service';
import { jsonIgnore } from 'json-ignore';
import _, { now } from 'lodash';

export abstract class dataStruct {
  @jsonIgnore()   
  _path: string = "";

  constructor (parentPath: string = "", ownPath: string = "")
  {
    this._path = parentPath;
    if (!this._path.endsWith('/'))
      this._path += '/';
    this._path += ownPath;
  }

  name(): string
  {
    return "";
  }

  children(): dataStruct[]
  {
    return [];
  }

  hasData(): boolean
  {
    return false;
  }

  async reload(_apiclient: ApiclientService)
  {
    this.postProcess();
  }

  checkLoaded(apiclient: ApiclientService)
  {
  }

  postProcess()
  {
    this.doPostProcess();
    console.dir(this);    
  }

  /**
   * Override in children with any post processing work that needs doing
   */
  doPostProcess()
  {
  }

  path(): string
  {
    return this._path;
  }
}

class KeyArray<T>
{
  [key: string]: T;
}

export abstract class dataDocArray<T>
{
  members: KeyArray<T> = {};

  insert(key: string, data:T)
  {
    this.members[key] = data;
  }

  delete(key:string)
  {
    delete this.members[key];
  }

  get(key:string):T
  {
    return this.members[key];
  }
}

export abstract class dataDoc extends dataStruct
{
  @jsonIgnore() 
  _name: string;

  lastupdate: number | undefined;

  constructor(parentPath: string, ownPath: string, name: string)
  {
    super(parentPath, ownPath);
    this._name = name;
  }

  override name(): string
  {
    return this._name;
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

  getLastUpdate(): Date
  {
    return new Date(this.lastupdate!);
  }

  isLoaded(): boolean
  {
    return (this.lastupdate !== undefined);
  }

}

export interface dataKey
{
    href: string;   
}

export interface dataItem
{
    id: number;
    key: dataKey;
    name: string;
    data?: any;
}