import { Component, Input, input } from "@angular/core";
import { extensionDataStruct, extensionsDataStruct } from "../../model/userdata";

@Component({
    selector: 'app-abstract-connection-settings',
    imports: [],
    template: '',
})
export class AbstractConnectionSettings {

    _settings?: extensionDataStruct;
    _hasSettings: boolean = false;

    @Input({required: true})
    set settings(value: extensionDataStruct){
        this._settings = value;
        this.ensurePropertiesExist(value);
        this._hasSettings = true;
    }
    get settings():extensionsDataStruct {
        return this._settings!;
    }

    ensurePropertiesExist(value: extensionDataStruct) {
    }

    hasSettings() {
        return this._hasSettings;
    }


}