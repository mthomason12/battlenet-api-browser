import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';
import { jsonIgnoreReplacer, jsonIgnore } from 'json-ignore';
import _ from 'lodash';
import { ApiclientService } from '../apiclient/apiclient.service';

export class dataStruct {
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
  }

  setData(value: any)
  {

  }
}

export class dataDoc extends dataStruct
{
  @jsonIgnore() 
  _name: string;
  data: any;

  constructor(name: string)
  {
    super();
    this._name = name;
    this.data = {};
  }

  override name(): string
  {
    return this._name;
  }  

  override hasData(): boolean
  {
    return true;
  }  

  override setData(value: any)
  {
    this.data = value;
  }

}


class achievementsDataDoc extends dataDoc
{
  constructor ()
  {
    super("Achievements");
  }

  override async reload(apiclient: ApiclientService)
  {
    this.setData(await apiclient.achievementIndex());
  }
}

class publicDataStruct extends dataStruct
{
  achievementData: achievementsDataDoc = new achievementsDataDoc();

  override name(): string
  {
    return "Game Data";
  }

  override children(): dataStruct[]
  {
    return super.children().concat([this.achievementData]);
  } 
}

class charDataStruct extends dataStruct
{
}

class charsDataStruct extends dataStruct
{
  items: charDataStruct[] = [];

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
  characters: charsDataStruct = new charsDataStruct();

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
  wowpublic: publicDataStruct = new publicDataStruct();
  wowprofile: profileDataStruct = new profileDataStruct();

  constructor()
  {
    super();
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
    console.log("Saving data");
    console.log("Saving data: "+JSON.stringify(this.data.apiData));        
  }
};

