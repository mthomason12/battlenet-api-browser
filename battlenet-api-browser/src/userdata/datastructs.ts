import { ApiclientService } from '../apiclient/apiclient.service';
import { jsonIgnore } from 'json-ignore';
import _, { now } from 'lodash';

export abstract class dataStruct {
  @jsonIgnore()   
  _path: string = "";
  @jsonIgnore()
  _parent?: dataStruct;

  constructor (parent?: dataStruct)
  {
    this._parent = parent;
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

  myPath(): string
  {
    return "";
  }

  path(): string
  {
    return (this._parent?.path() ?? "")+"/"+this.myPath();
  }
}


export abstract class dataDoc extends dataStruct
{
  @jsonIgnore() 
  _name: string;

  lastupdate: number | undefined;

  constructor(parent: dataStruct, name: string)
  {
    super(parent);
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