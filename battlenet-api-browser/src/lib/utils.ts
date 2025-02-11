/** Shared Utils Library */

/** Array extension functions */

declare global {
  
  interface Array<T>
  {
      onlyUnique(): any[];
      merge(arr: any[], key: string): any[]
  }
}

/**
 * Return only unique values from the array
 */
Array.prototype.onlyUnique = function(): any[] {
    return this.filter((value, index, arr) => {return arr.indexOf(value) === index});
}

/**
 * Merge a 2nd array over the current array, using key as the unique record identifier, and return the result
 */
Array.prototype.merge = function(arr: any[], key: string): any[] {
  return Array.from([...this, ...arr]
    .reduce((prev, current) => prev.set(current[key], current), new Map)
    .values());
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


/**
 * Convert string into format usable as an API slug, by replacing spaces and underscores with hyphens and returning the result in lowercase
 */
export function Slugify(str: string): string {
  const regex = /[_ ]/g;
  return (str.replace(regex,"-").toLowerCase());
}