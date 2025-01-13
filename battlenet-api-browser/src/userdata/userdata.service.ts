import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

type dataDoc = any;

class dataStruct{
  [key: string]: any;
}

class achievementDataStruct extends dataStruct
{

}

class publicDataStruct extends dataStruct
{
  achievementData: dataDoc;
}

class charDataStruct extends dataStruct
{
}

class profileDataStruct extends dataStruct
{
  characters: charDataStruct = new charDataStruct();
}

class apiDataStruct extends dataStruct
{
  public: publicDataStruct = new publicDataStruct();
  profile: profileDataStruct = new profileDataStruct();
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
  public data: userDataStruct;

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
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data));
    //console.log("Saving data: "+JSON.stringify(this.data));        
  }
}
