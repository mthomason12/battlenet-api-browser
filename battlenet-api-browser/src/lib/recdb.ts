import { IDBPDatabase, openDB } from 'idb';

/**
 * RecDB - A layer over IndexedDB for accessing individually-stored records
 */
export class RecDB {

    db?: IDBPDatabase;

    constructor(){       
    }

    connect(): Promise<void>
    {
        return new Promise<void>((resolve, reject)=>{
            console.log("Opening RecDB");
            openDB('recdb',1, {
                upgrade(db, oldversion, newversion) {
                }
            }).then((db) => { 
                this.db = db; 
                resolve();
            });
        });
    }


}