import { inject, Injectable, Type } from '@angular/core';
import { AbstractExtension, ExtensionRegistration } from './abstract/abstract-extension'
import { UserdataService } from '../services/userdata.service';
import { APIConnection } from '../lib/apiconnection'
import { extensions } from './app.extensions';
import { apiClientService } from '../services/apiclient.service';

class ExtensionRecord{
  ext: AbstractExtension;
  registration: ExtensionRegistration;

  constructor(ext: AbstractExtension, reg: ExtensionRegistration) {
    this.ext = ext;
    this.registration = reg;
  }
}

class ConnectionRecord {
  conn: Type<APIConnection>;
  settings: Type<object>

  constructor (conn: Type<APIConnection>, settings: Type<object>)
  {
    this.conn = conn;
    this.settings = settings;
  }
}

@Injectable({
  providedIn: 'root'
})
/**
 * Service to manage dynamic extensions to the api browser
 */
export class ExtensionManagerService {

  extensions: ExtensionRecord[] = [];
  connections: Map<string, ConnectionRecord> = new Map();

  data: UserdataService = inject(UserdataService);

  constructor() { 
    //load extensions
    extensions.forEach((extension)=>{
      this.load(extension.class);
    })
  }

  load( extension: Type<AbstractExtension>) {
    const newExt = new extension();
    const reg = newExt.getRegistration();

    //register the extension
    this.extensions.push(new ExtensionRecord(newExt, reg));

    //add connections
    reg.connections?.forEach((conn)=>{
      this.connections.set(conn.name, new ConnectionRecord(conn.class, conn.settingsComponent));
    });
  }


}
