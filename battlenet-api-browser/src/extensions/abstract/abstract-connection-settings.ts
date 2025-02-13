import { Component, Input, input } from "@angular/core";
import { extensionDataStruct } from "../../model/userdata";

@Component({
    selector: 'app-abstract-connection-settings',
    imports: [],
    template: '',
})
export class AbstractConnectionSettings {

    _settings?: extensionDataStruct;

    @Input()
    set settings(value: extensionDataStruct){
        this._settings = this.ensurePropertiesExist(value);
    }

    ensurePropertiesExist(value: extensionDataStruct): extensionDataStruct {
        return value;
    }


}