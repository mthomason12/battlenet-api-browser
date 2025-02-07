import { dataStruct } from './datastructs';
import { profileDataStruct } from './profile';
import { publicDataStruct } from './publicdata';
import { accountDataStruct } from './account';
import { RecDB } from '../lib/recdb';

/**
 * All API data retrieved and stored in the application
 */
export class apiDataStruct extends dataStruct
{
  wowpublic: publicDataStruct;
  wowaccount: accountDataStruct;
  wowprofile: profileDataStruct;

  /**
   * Constructor
   */
  constructor(recDB: RecDB)
  {
    super(undefined);
    this.wowpublic = new publicDataStruct(this, recDB);
    this.wowaccount = new accountDataStruct(this, recDB);
    this.wowprofile = new profileDataStruct(this, recDB);
  }

  /**
   * @inheritdoc
   */  
  override getName(): string
  {
    return "Battle.net API";
  }

  /**
   * @inheritdoc
   */
  override children(): dataStruct[]
  {
    return super.children().concat([
      this.wowpublic, 
      this.wowaccount,
      this.wowprofile
    ]);
  }

  /**
   * @inheritdoc
   */
  override myPath(): string {
      return "browse";
  }

  //fix up any references after reloading from JSON
  override postFixup()
  {
      this.wowpublic.fixup(this);
      this.wowaccount.fixup(this);
      this.wowprofile.fixup(this);
  }
}

/**
 * Data for application API access - Client ID and Secret 
 */
export class appKeyStruct
{
  clientID: string = "";
  clientSecret: string = "";
}

export enum ConnectionType {
  direct = 0, 
  apiproxy = 1
}

export class settingsStruct
{
  autoConnect: boolean = false;
  autoLogin: boolean = false;
  proxyAddress: string = "";
  connectionType: ConnectionType = ConnectionType.direct;
}

export class extensionsDataStruct
{
  [key: string] : any;
}

/**
 * All data held by {@link UserdataService}
 */
export class userDataStruct
{
  key: appKeyStruct = new appKeyStruct();
  settings: settingsStruct = new settingsStruct();
  extensions: extensionsDataStruct = new extensionsDataStruct();
  apiData: apiDataStruct;
  
  constructor (recDB: RecDB)
  {
    this.apiData = new apiDataStruct(recDB);
  }
}
