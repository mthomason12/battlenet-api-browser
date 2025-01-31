import { IDBPDatabase, openDB } from 'idb';

export class RecDBRec {
    type: string;
    id: string;
    data: object | undefined;

    constructor (type: string, id: string, data: object | undefined = undefined)
    {
        this.type = type;
        this.id = id;
        this.data = data;
    }
}

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

    get(store: string, query: IDBValidKey): Promise<any> | undefined
    {
        return this.db?.get(store, query);
    }

    getAll(store: string, query: IDBValidKey): Promise<any> | undefined
    {
        return this.db?.getAll(store, query);
    }

    add(store: string, type: string, id: string, data: object): Promise<IDBValidKey> | undefined
    {
        var rec: RecDBRec = new RecDBRec(type, id, data);
        return this.db?.add(store, rec);
    }


}