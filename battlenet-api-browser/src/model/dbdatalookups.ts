import { apiClientService } from "../services/apiclient.service";
import { topDataStruct } from "./datastructs";
import { dbData } from "./dbdatastructs";

interface dbDataLookupTable {
    source: topDataStruct;
    name: string;
}

export class dbDataLookups {
    tables: Map<string, dbData<any,any>> = new Map();
    api: apiClientService;
    ready: Promise<any>;
    loadPromises: Promise<any>[] = Array();

    constructor(api: apiClientService) {
      this.api = api;
      //initialize with a promise of the empty list
      this.ready = Promise.allSettled(this.loadPromises);
    }

    add(tables: dbDataLookupTable[]){
      tables.forEach((tableToLoad)=>{
        this.loadPromises.push(this.loadTable(tableToLoad.source, tableToLoad.name));
      })
      this.ready = Promise.allSettled(this.loadPromises);
    }

    loadTable(source: topDataStruct, name: string): Promise<void> {
      return new Promise((resolve)=>{
        const data = source.getData(name);
        if (data)
        {
          this.tables.set(name, data);
          data.getIndex(this.api).then((idx)=>{
            resolve();
          }, ()=>{ resolve(); })
        }
        resolve();
      });
    }

    getTable(name: string): dbData<any,any> | undefined {
      return this.tables.get(name);
    }

    /**
     * Check if the given table already has the specified key value physically in its database
     * A false value does not mean the record does not exist, just that it hasn't been stored,
     * and should still be requested using @see {@link dbDataLookups.lookup}
     * 
     * This can be useful in knowing whether to request the lookup immediately or 
     * add it to a request queue.
     * @param table 
     * @param value 
     */
    has(table: string, value: number | string): Promise<boolean> {
        const tab = this.getTable(table);
        if (tab)
        {
            return tab.hasDBRec(value)
        }
        return new Promise((resolve)=>{ resolve(false)} );
    }

    lookup<T>(table: string, value: number | string): Promise<T | undefined> {
      return new Promise((resolve)=>{
        this.ready.then(()=>{
            const tab = this.getTable(table);
            if (tab)
                {
                  const item = this.getTable(table)?.getRec(this.api, value) as T;
                  resolve(item );
                }
          else 
            resolve(undefined);
        });
      });
    }
}