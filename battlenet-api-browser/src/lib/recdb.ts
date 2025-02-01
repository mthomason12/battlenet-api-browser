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

    private _dbName: string;
    private _store: string;

    constructor(dbName: string, store: string){       
        this._dbName = dbName;
        this._store = store;
    }

    connect(): Promise<IDBPDatabase>
    {
        var store = this._store;
        return new Promise<IDBPDatabase>((resolve, reject)=>{
            console.log("Opening RecDB");
            openDB(this._dbName,2, {
                upgrade(db, oldversion, newversion, transaction) {
                    //upgrade to version 2
                    if (oldversion < 1)
                    {
                        db.createObjectStore(store,{keyPath: ['type', 'id']});
                        transaction.objectStore(store).createIndex('id','id');
                        transaction.objectStore(store).createIndex('type','type');
                    }
                }
            }).then((db) => { 
                this.db = db; 
                resolve(db);
            });
        });
    }

    get(type: string, id: string): Promise<RecDBRec> | undefined
    {
        return this.db?.get(this._store, [type, id]);
    }

    getAll(type: string): Promise<RecDBRec[]> | undefined
    {
        return this.db?.getAllFromIndex(this._store, 'type', type);
    }

    add(type: string, id: string, data: object): Promise<IDBValidKey> | undefined
    {
        var rec: RecDBRec = new RecDBRec(type, id, data);
        return this.db?.add(this._store, rec);
    }


}