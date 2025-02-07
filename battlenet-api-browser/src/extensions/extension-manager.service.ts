import { inject, Injectable, Type } from '@angular/core';
import { AbstractExtension, ExtensionRegistration } from './abstract/abstract-extension'
import { UserdataService } from '../services/userdata.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service to manage dynamic extensions to the api browser
 */
export class ExtensionManagerService {

  extensions: AbstractExtension[] = [];
  registrations: ExtensionRegistration[] = [];

  data: UserdataService = inject(UserdataService);

  constructor() { 
  }

  load( extension: Type<AbstractExtension>) {
    var newExt = new extension();
    this.extensions.push(newExt);
    this.registrations.push(newExt.getRegistration());

  }


}
