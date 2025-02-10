import { IDBPDatabase, openDB } from 'idb';

export class RecDBRec {
    type: string;
    id: recID;
    data: object | undefined;

    constructor (type: string, id: recID, data: object | undefined = undefined)
    {
        this.type = type;
        this.id = id;
        this.data = data;
    }
}

//record id type
export type recID = string | number;


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
            console.log("Opening RecDB "+this._dbName+"/"+this._store);
            openDB(this._dbName,5, {
                upgrade(db, oldversion, newversion, transaction) {
                    //upgrade to version 2
                    if (oldversion < 2)
                    {
                        db.createObjectStore(store,{keyPath: ['type', 'id']});
                        transaction.objectStore(store).createIndex('id','id');
                        transaction.objectStore(store).createIndex('type','type');
                    }
                    //upgrade to version 3
                    if (oldversion < 3)
                        {
                            //add an index on "name" (it might not exist, but that's fine)
                            transaction.objectStore(store).createIndex('name','data.name');
                        }
                    //upgrade to version 5
                    if (oldversion < 5)
                        {
                            //add an index on "lastUpdate" (it might not exist, but that's fine)
                            transaction.objectStore(store).createIndex('lastUpdate','data.lastUpdate');
                        }                        
                }
            }).then((db) => { 
                this.db = db; 
                resolve(db);
            });
        });
    }

    get(type: string, id: recID): Promise<RecDBRec | undefined> | undefined
    {
        return this.db?.get(this._store, [type, id]);
    }

    getAll(type: string): Promise<RecDBRec[]>
    {
        return this.db!.getAllFromIndex(this._store, 'type', type);
    }

    getKeys(type: string): Promise<recID[]>
    {
        return new Promise((resolve)=>{
            const transaction = this.db!.transaction([this._store], "readonly");
            const objstore = transaction.objectStore(this._store);
            const idx = objstore.index("type");
            const range = IDBKeyRange.only(type);
            idx.getAllKeys(range).then((keys)=>{
                resolve(keys.map((key)=>{ return (key as Array<recID>)[1]}));
            });
        });
    }

    clear(type: string): Promise<void> {
        return new Promise((resolve)=>{
            //delete index
            this.db!.delete(this._store, ['index', type]).then(()=>{
                this.db!.delete(this._store, [type, ""]).then(()=>{
                    resolve();
                });
            });
        });
    }

    delete(type: string, id: recID): Promise<void> {
        return this.db!.delete(this._store, [type, id]);
    }

    add(type: string, id: recID, data: object): Promise<IDBValidKey>
    {
        return new Promise<IDBValidKey>((resolve)=>{
            this.delete(type, id).then(()=>{
                var rec: RecDBRec = new RecDBRec(type, id, data);
                resolve(this.db!.add(this._store, rec));
            })
        });
    }


}