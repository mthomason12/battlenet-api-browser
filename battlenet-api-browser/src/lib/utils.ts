/** Shared Utils Library */

/** Array extension functions */

declare global {
  
  interface Array<T>
  {
      onlyUnique(): any;
  }
}

Array.prototype.onlyUnique = function(): any[] {
    return this.filter((value, index, arr) => {return arr.indexOf(value) === index});
}


/* Return object properties as array */

export interface propertyData {
  name: string;
  value: any;
}

export function ObjToArray(obj: any): propertyData[]
{
  return Object.keys(obj).map((value, index, array)=>{
      return {
        name: value,
        value: obj[value]
      }
  });
}