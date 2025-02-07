import { Type } from "@angular/core";

interface Extension {
    class: Type<any>
}

export type ExtensionList = Extension[];