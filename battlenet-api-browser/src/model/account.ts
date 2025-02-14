import { dataStruct, topDataStruct } from './datastructs';
import { accountCharsDataDoc } from './account-characters';
import { RecDB } from '../lib/recdb';
import { accountHeirloomsDataDoc } from './account-heirlooms';
import { accountMountsDataDoc } from './account-mounts';
import { accountPetsDataDoc } from './account-pets';

export class accountDataStruct extends topDataStruct
{

  constructor(parent: dataStruct, recDB: RecDB)
  {
    super(parent, recDB);
  
    this.Register(accountCharsDataDoc);
    this.Register(accountHeirloomsDataDoc);
    this.Register(accountMountsDataDoc);
    this.Register(accountPetsDataDoc);

    this.icon = "folder";
  }

  override getName(): string
  {
    return "Account Data";
  }

  override children(): dataStruct[]
  {
    //convert the map to an array, then pull the .ref property from each, then concat those into children()
    return super.children().concat(Array.from(this.data.values()).map((value)=>{ return value.ref }));
  }  

  override myPath(): string {
      return "account";
  }

}