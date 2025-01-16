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

  postProcess()
  {
  }

  path(): string
  {
    return this._path;
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
      () => {this.lastupdate = now()}
    )
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
}