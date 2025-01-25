import { dataStruct } from './datastructs';
import { profileDataStruct } from './profile';
import { publicDataStruct } from './gamedata';
import { accountDataStruct } from './account';

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
  constructor()
  {
    super(undefined);
    this.wowpublic = new publicDataStruct(this);
    this.wowaccount = new accountDataStruct(this);
    this.wowprofile = new profileDataStruct(this);
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
class appKeyStruct
{
  clientID: string = "";
  clientSecret: string = "";
}

/**
 * All data held by {@link UserdataService}
 */
export class userDataStruct
{
  key: appKeyStruct = new appKeyStruct();
  apiData: apiDataStruct = new apiDataStruct();
}
