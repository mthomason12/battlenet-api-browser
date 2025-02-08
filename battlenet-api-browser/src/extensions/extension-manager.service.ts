import { inject, Injectable, Type } from '@angular/core';
import { AbstractExtension, ExtensionRegistration } from './abstract/abstract-extension'
import { UserdataService } from '../services/userdata.service';
import { APIConnection } from '../lib/apiconnection'
import { extensions } from './app.extensions';


@Injectable({
  providedIn: 'root'
})
/**
 * Service to manage dynamic extensions to the api browser
 */
export class ExtensionManagerService {

  extensions: AbstractExtension[] = [];
  registrations: ExtensionRegistration[] = [];
  connections: Map<string, APIConnection> = new Map();

  data: UserdataService = inject(UserdataService);

  constructor() { 
    //load extensions
    extensions.forEach((extension)=>{
      this.load(extension.class);
    })
  }

  load( extension: Type<AbstractExtension>) {
    var newExt = new extension();
    this.extensions.push(newExt);
    this.registrations.push(newExt.getRegistration());
  }


}
