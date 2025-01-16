import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';
import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import _, { now } from 'lodash';
import { ApiclientService } from '../apiclient/apiclient.service';

export class dataStruct {
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

  async reload(apiclient: ApiclientService)
  {
    this.postProcess();
  }

  setData(value: any)
  {
  }

  postProcess()
  {
  }

  path(): string
  {
    return this._path;
  }
}

export class dataDoc extends dataStruct
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

interface dataKey
{
  href: string;
}

interface dataItem
{
  id: number;
  key: dataKey;
  name: string;
}

interface achievement extends dataItem
{
}

interface covenant extends dataItem
{
}


export class achievementsDataDoc extends dataDoc
{
  achievements: achievement[] = new Array();

  constructor (parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath, "Achievements");
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getAchievementIndex()?.then (
      (data: any) => {
        this.achievements = data;
        super.reload(apiclient);
      }
    );
  }

  override postProcess()
  {
    console.log("PostProcessing");
    this.achievements = this.achievements.sort(function(a:any, b:any){return a.id - b.id});
  }
}

export class covenantsDataDoc extends dataDoc
{
  covenants: covenant[] = new Array();

  constructor (parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath,"Covenants");   
  }

  override async reload(apiclient: ApiclientService)
  {
    await apiclient.getCovenantIndex()?.then (
      (data: any) => {
        this.covenants = data;
        super.reload(apiclient);
      }
    );
  }

  override postProcess()
  {
    console.log("PostProcessing");
    this.covenants = this.covenants.sort(function(a:any, b:any){return a.id - b.id});
  }
}

class publicDataStruct extends dataStruct
{
  achievementData: achievementsDataDoc;
  covenantData: covenantsDataDoc;

  constructor(parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath);
    this.achievementData = new achievementsDataDoc(this._path, "achievements");
    this.covenantData = new covenantsDataDoc(this._path, "covenants");
  }

  override name(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.achievementData, this.covenantData]);
  } 
}

class charDataStruct extends dataStruct
{
}

class charsDataStruct extends dataStruct
{
  items: charDataStruct[] = [];

  constructor(parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath);
  }

  override name(): string
  {
    return "Characters";
  }  

  override children(): dataStruct[]
  {
    return this.items;
  }    
}

class profileDataStruct extends dataStruct
{
  characters: charsDataStruct;

  constructor(parentPath: string, ownPath: string)
  {
    super(parentPath, ownPath);
    this.characters = new charsDataStruct(this._path, "characters");
  }

  override name(): string
  {
    return "Profile";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.characters]);
  }  
}

class apiDataStruct extends dataStruct
{
  wowpublic: publicDataStruct;
  wowprofile: profileDataStruct;

  constructor()
  {
    super("","");
    this.wowpublic = new publicDataStruct(this._path,"public");
    this.wowprofile = new profileDataStruct(this._path,"profile");
  }

  override name(): string
  {
    return "Battle.net API";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.wowpublic, this.wowprofile]);
  }
}

class appKeyStruct
{
  clientID: string = "";
  clientSecret: string = "";
}

class userDataStruct
{
  key: appKeyStruct = new appKeyStruct();
  apiData: apiDataStruct = new apiDataStruct();
}

const dataItem: string = 'battlenet-api-data';

@Injectable({  providedIn: 'root',})

export class UserdataService {
  public data: userDataStruct = new userDataStruct();
  currentData?: dataStruct;

  constructor()
  {
    //attempt to load existing data from localstorage
    console.log("Initializing Data Storage");
    console.log("Loading application key");
    //load app keys first from LocalStorage
    try
    {
      var json = JSON.parse(localStorage.getItem(dataItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      }
      //console.log("Incoming Data: "+JSON.stringify(json));  
      this.data.key = _.merge(this.data.key, json)  
      //this.data = Object.assign(new userDataStruct(), json);
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("User data is corrupt or missing. Reinitializing with empty data.")   
      this.data = new userDataStruct();   
    }
    //load saved api data from IndexedDB
    console.log("Loading stored api data");
    const db = openDB('data',1, {
      upgrade(db) {
        db.createObjectStore('data');
      }
    }).then (
      db => {
        db.get('data','wowpublic').then (
          res => {
            if (res != undefined)
            {
              this.data.apiData.wowpublic = _.merge(this.data.apiData.wowpublic, JSON.parse(res));
            }
          }
        );
        db.get('data','wowprofile').then (
          res => {
            if (res != undefined)
            {
              this.data.apiData.wowprofile = _.merge(this.data.apiData.wowprofile, JSON.parse(res));
            }
          }
        );        
      }
    );
    //console.log("Data after loading: "+JSON.stringify(this.data));
    console.dir(this.data);    
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data.key));
    //save to indexedDB
    const db = openDB('data',1).then(
      db => {
        db.put('data', JSON.stringify(this.data.apiData.wowpublic, jsonIgnoreReplacer), 'wowpublic');
        db.put('data', JSON.stringify(this.data.apiData.wowprofile, jsonIgnoreReplacer), 'wowprofile');        
      }
    );
    console.log("Saving data: "+JSON.stringify(this.data.apiData));        
  }

  setCurrent(data: dataStruct)
  {
    this.currentData = data;
  }

  getCurrent(): dataStruct | undefined
  {
    return this.currentData;
  }
};

