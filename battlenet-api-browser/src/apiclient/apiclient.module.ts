import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlizzAPI, RegionIdOrName, QueryOptions } from 'blizzapi';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class ApiclientModule { 
  region?: RegionIdOrName;
  clientID?: string;
  clientSecret?: string;
  blizzapi?: BlizzAPI;
  connected: boolean = false;

  constructor ()
  {
  }

  connect(region: RegionIdOrName, clientID: string, clientSecret: string)
  {
    this.region = region;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.blizzapi = new BlizzAPI({
      region: region,
      clientId: clientID,
      clientSecret: clientSecret
    });    
    this.connected = true;
  }

  query(apiEndpoint: string, options: QueryOptions)
  {
    return this.blizzapi?.query(apiEndpoint, options);
  }

}
