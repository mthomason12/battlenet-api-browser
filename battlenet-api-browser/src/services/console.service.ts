import { inject, Injectable } from '@angular/core';
import { UserdataService } from './userdata.service';
import { RecDB } from '../lib/recdb';

@Injectable({
  providedIn: 'root'
})
/**
 * Exposes an interface to the Javascript console as the "bna" object.
 * This can be used for debugging, to allow the Electron host app in the standalone version to 
 * call functions, and possibly for external Javascript addons later... 
 * 
 * For access from the Electron main process, use
 * window.webContents.executeJavaScript('bna._whatever_');
 */
export class ConsoleService {

  data = inject(UserdataService);
  cons = this;

  consoleObject: ConsoleObject;

  constructor() { 
    this.consoleObject = new ConsoleObject(this.data.recDB);
    this.buildConsoleInterface();
  }

  /**
   * Add default items into the console interface
   */
  buildConsoleInterface() {
    // Add defaults
    this.consoleObject = {...this.consoleObject, ...this.data.data.buildConsoleInterface() };
    //expose as global variable to console
    (window as any)['bna'] = this.consoleObject;
  }

  /**
   * Merges a new object into the console interface.
   * 
   * Note that the *existing* object will overwrite merged members, preventing addons from
   * overriding the default members.
   * @param merge 
   */
  addToConsoleInterface(merge: object) {
    this.consoleObject = { ...merge, ...this.consoleObject};
    (window as any)['bna'] = this.consoleObject;
  }

}

class ConsoleObject {
    recDB: RecDB;

    constructor(recDB: RecDB) {
      this.recDB = recDB;
    }
}
