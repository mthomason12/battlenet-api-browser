import { Type } from "@angular/core";

interface Extension {
    name: string;
    class: Type<any>
}

export type ExtensionList = Extension[];