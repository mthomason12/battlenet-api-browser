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
            openDB('recdb',2, {
                upgrade(db, oldversion, newversion, transaction) {
                    //upgrade to version 2
                    if (oldversion < 1)
                    {
                        db.createObjectStore('wow-p-data',{keyPath: ['type', 'id']});
                        transaction.objectStore('wow-p-data').createIndex('id','id');
                        transaction.objectStore('wow-p-data').createIndex('type','type');
                    }
                }
            }).then((db) => { 
                this.db = db; 
                resolve();
            });
        });
    }


}