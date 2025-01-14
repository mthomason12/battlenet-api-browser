import { Injectable } from '@angular/core';

export class dataStruct {
  _name: string = 'unnamed';
  [key: string]: any;

  name(): string
  {
    return this._name;
  }

  children(): dataStruct[]
  {
    return [];
  }
}

export class dataDoc extends dataStruct
{
  constructor(name: string)
  {
    super();
    this._name = name;
  }
}


class achievementsDataDoc extends dataDoc
{
  constructor()
  {
    super("Achievements");
  }

  override name(): string
  {
    return "Achievements";
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
  public: publicDataStruct = new publicDataStruct();
  profile: profileDataStruct = new profileDataStruct();

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
    return super.children().concat([this.public, this.profile]);
  }
}

class userDataStruct
{
  clientID: string = "";
  clientSecret: string = "";
  apiData: apiDataStruct = new apiDataStruct();
}

const dataItem: string = 'battlenet-api-data';

@Injectable({  providedIn: 'root',})

export class UserdataService {
  public data: userDataStruct = new userDataStruct();

  constructor()
  {
    console.log("Initializing Data Storage");
    //attempt to load existing data from localstorage
    try
    {
      var json = JSON.parse(localStorage.getItem(dataItem)!);
      if (json === null) 
      {
        throw new Error("No data");
      }
      //console.log("Incoming Data: "+JSON.stringify(json));    
      this.data = Object.assign(new userDataStruct(), json);
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("User data is corrupt or missing. Reinitializing with empty data.")   
      this.data = new userDataStruct();   
      this.data.clientID = "";
      this.data.clientSecret = "";
    }
    console.log("Data after loading: "+JSON.stringify(this.data));
    console.dir(this.data);    
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data));
    //console.log("Saving data: "+JSON.stringify(this.data));        
  }
}
