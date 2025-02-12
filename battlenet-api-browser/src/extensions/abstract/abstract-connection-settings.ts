import { Component, input } from "@angular/core";
import { extensionDataStruct } from "../../model/userdata";

@Component({
    selector: 'app-abstract-connection-settings',
    imports: [],
    template: '',
})
export class AbstractConnectionSettings {

    settings = input.required<extensionDataStruct>();

}