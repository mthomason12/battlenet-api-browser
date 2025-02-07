import { Type } from "@angular/core";

export abstract class AbstractExtension {

    /**
     * Return extension registration structure
     */
    abstract getRegistration(): ExtensionRegistration;

}

export interface ExtensionRegistration {

    //different connection methods
    connections:{
        name: string; //name
        class: Type<any> //name of class to instantiate for connection option
        settingsComponent: Type<any> //name of component to add to settings dialog
    }[];

    //additional tabs to add to the settings dialog
    settingsPages: {
        title: string;
        class: Type<any>;
    }
}