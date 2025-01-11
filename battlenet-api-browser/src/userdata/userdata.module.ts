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
    try
    {
      this.data = JSON.parse(localStorage.getItem(dataItem)!) as userDataStruct;
    }
    catch
    {
      console.log("User data is corrupt or missing. Reinitializing with empty data.")
      this.data = {} as userDataStruct;
    }
    
    //attempt to load existing data from localstorage
  }

  save()
  {
    localStorage.setItem(dataItem, JSON.stringify(this.data));
  }
}
