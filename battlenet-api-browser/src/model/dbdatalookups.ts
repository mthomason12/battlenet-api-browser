import { apiClientService } from "../services/apiclient.service";
import { topDataStruct } from "./datastructs";
import { dbData } from "./dbdatastructs";
import { apiDataStruct } from "./userdata";

interface dbDataLookupTable {
    source: topDataStruct;
    name: string;
}

export class dbDataLookups {
    tables: Map<string, dbData<any,any>> = new Map();
    api: apiClientService;
    ready: Promise<any>;

    constructor(apiData: apiDataStruct, api: apiClientService,  tables:dbDataLookupTable[]) {
      this.api = api;
      const loadPromises: Promise<any>[] = Array();
      tables.forEach((tableToLoad)=>{
        loadPromises.push(this.loadTable(tableToLoad.source, tableToLoad.name));
      })
      this.ready = Promise.allSettled(loadPromises);
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