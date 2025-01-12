import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';

interface publicDataStruct
{
  [key: string]: any;
}

interface profileDataStruct
{
  [key: string]: any;  
}

interface apiDataStruct
{
  public: publicDataStruct;
  profile: profileDataStruct;
  [key: string]: any;  
}

interface userDataStruct
{
  clientID: string;
  clientSecret: string;
  apiData: apiDataStruct;
  [key: string]: any;  
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
      this.data = <userDataStruct>JSON.parse(localStorage.getItem(dataItem)!);     
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("User data is corrupt or missing. Reinitializing with empty data.")      
      this.data = <userDataStruct>{};
      this.data.clientID = "";
      this.data.clientSecret = "";
    }
    if (this.data === null)
    {
      this.data = {
        clientID: "",
        clientSecret: "",
        apiData: {
          public: {},
          profile: {}
        }
      }
    }
    console.log("Data: "+JSON.stringify(this.data));    
    if (!Object.hasOwn(this.data, "clientID")) this.data.clientID = "";
    if (!Object.hasOwn(this.data, "clientSecret")) this.data.clientSecret = "";
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data));
  }
}
