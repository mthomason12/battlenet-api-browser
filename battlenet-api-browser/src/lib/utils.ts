/** Shared Utils Library */

/** Array extension functions */

declare interface Array<T>
{
    onlyUnique(): any;
}

Array.prototype.onlyUnique = function() {
    return this.filter((value, index, arr) => {return arr.indexOf(value) === index});
}