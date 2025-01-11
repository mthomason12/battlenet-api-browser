import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

interface apiDataStruct
{

}

interface userDataStruct
{
  clientID: String;
  clientSecret: String;
  apiData: apiDataStruct;
}

const dataItem: string = 'battlenet-api-data';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class UserdataModule {
  public data: userDataStruct;

  constructor()
  {
    //attempt to load existing data from localstorage
    try
    {
      this.data = JSON.parse(localStorage.getItem(dataItem)!) as userDataStruct;
    }
    catch
    {
      //initialize with blank data if corrupt or missing
      console.log("User data is corrupt or missing. Reinitializing with empty data.")
      this.data = {} as userDataStruct;
    }
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data));
  }
}
