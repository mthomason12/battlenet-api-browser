import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlizzAPI, RegionIdOrName, QueryOptions } from 'blizzapi';

export class ApiclientService { 
  region?: RegionIdOrName;
  clientID?: string;
  clientSecret?: string;
  blizzapi?: BlizzAPI;
  accessToken: string = "";
  staticNamespace: string = "static-us";
  dynamicNamespace: string = "dynamic=us";
  profileNamespace: string = "profile-us";
  locale: string = "en_US";
  
  connected: boolean = false;

  constructor ()
  {
  }

  async connect(region: RegionIdOrName, clientID: string, clientSecret: string)
  {  
    this.region = region;
    this.clientID = clientID;
    this.clientSecret = clientSecret;
    this.blizzapi = new BlizzAPI({
      region: region,
      clientId: clientID,
      clientSecret: clientSecret
    });    
    //get an access token
    this.accessToken = await this.blizzapi?.getAccessToken();
    this.connected = true;
  }

  query(apiEndpoint: string, options: QueryOptions = {})
  {
    return this.blizzapi?.query(apiEndpoint, options);
  }

  isConnected(): boolean
  {
    return this.connected;
  }

  achievementIndex(): Promise<any> | undefined
  {
    return this.query('/data/wow/achievement/index?namespace='+this.staticNamespace+'&locale='+this.locale);
  }

  covenantIndex(): Promise<any> | undefined
  {
    return this.query('/data/wow/covenant/index?namespace='+this.staticNamespace+'&locale='+this.locale);
  }  

}
