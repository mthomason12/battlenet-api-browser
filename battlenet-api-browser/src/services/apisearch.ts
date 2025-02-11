/**
 * A class for building search parameters for the Battle.net API
 */
export class APISearchParams {

    params: APISearchOperation[];

    constructor() {
        this.params = [];
    }

    add(field: string, values: APISearchValues, operator: APISearchOperator = APISearchOperator.AND): APISearchParams
    {
        this.params.push(new APISearchOperation(field, values, operator));
        return this;
    }

    find(field: string): APISearchOperation | undefined
    {
        return this.params.find((item)=>{ return item.field === field });
    }

    toQueryString(): string {
        return this.params.join("&");
    }
}

class APISearchOperation {

    field: string;
    operator: APISearchOperator;
    values: APISearchValues;

    constructor (field: string, values: APISearchValues, operator: APISearchOperator = APISearchOperator.AND ) {
        this.field = field;
        this.operator = operator;
        this.values = values;
    }

    operation(): string {
        var result: string = "";
        switch (this.operator) {
            case APISearchOperator.AND:
                result = "="+this.values[0];
                break;
            case APISearchOperator.OR:
                result = "="+this.values.join("||");
                break;
            case APISearchOperator.NOT:
                result = "!="+this.values[0];
                break;
            case APISearchOperator.RANGE:
                result = "=["+this.values[0]+","+this.values[1]+"]";
                break;
            case APISearchOperator.MIN:
                result = "=["+this.values[0]+",]";
                break;
            case APISearchOperator.MAX:
                result = "=[,"+this.values[0]+"]";
                break;
        }
        return result;
    }

    toString(): string {
        return this.field+this.operation()
    }
}

enum APISearchOperator {
    AND = 0,
    OR = 1,
    NOT = 2,
    RANGE = 3, 
    MIN = 4,
    MAX = 5
}

type APISearchValues = string[]