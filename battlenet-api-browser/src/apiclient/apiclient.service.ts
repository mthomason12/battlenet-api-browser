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

  queryStatic(apiEndpoint: string, options: QueryOptions = {})
  {
    return this.query(apiEndpoint+"?namespace="+this.staticNamespace+'&locale='+this.locale, options);
  }  

  isConnected(): boolean
  {
    return this.connected;
  }

  //#region Achievements API

  getAchievementIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/achievement/index');
  }

  getAchievement(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/achievement/${id}`);
  }

  getAchievementMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/achievement/${id}`);
  }

  getAchievementCategoryIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/achievement-category/index');
  }

  getAchievementCategory(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/achievement-category/${id}`);
  }  

  //#endregion

  //#region Auctions API

  getAuctions(connectedRealmID: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/connected-realm/auctions/${connectedRealmID}`);
  } 

  getCommodities(): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/auctions/commodities`);
  }   

  //#endregion

  //#region Azerite Essence API

  getAzeriteEssenceIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/azerite-essence/index');
  }  

  getAzeriteEssence(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/azerite-essence/${id}`);
  }    

  getAzeriteEssenceMedia(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/media/azerite-essence/${id}`);
  }      

  //#endregion

  //#region Covenants

  getCovenantIndex(): Promise<any> | undefined
  {
    return this.queryStatic('/data/wow/covenant/index');
  }  

  getCovenant(id: number): Promise<any> | undefined
  {
    return this.queryStatic(`/data/wow/covenant/${id}`);
  }  

  //#endregion

}
