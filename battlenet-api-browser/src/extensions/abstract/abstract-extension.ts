import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { topDataStruct } from "../../model/datastructs";

export abstract class AbstractExtension {

    /**
     * Return extension registration structure
     */
    abstract getRegistration(): ExtensionRegistration;

    /**
     * Return a new top-level data struct.
     * Is only called if extendsData is set to true in the extension registration.
     * 
     * To use, override without calling super.extendData().
     * @param data 
     */
    extendData(): topDataStruct | undefined {
        return undefined;
    }

}

export interface ExtensionRegistration {

    name: string,
    version?: string,
    author?: string,
    website?: string,
    //different connection methods
    connections?:{
        name: string; //name
        class: Type<APIConnection> //name of class to instantiate for connection option
        settingsComponent: Type<any> //name of component to add to settings dialog
    }[];

    //additional tabs to add to the settings dialog
    settingsPages?: {
        title: string;
        class: Type<any>;
    }

    extendsData: boolean; //whether the extension extends the data schema or not

    //additional routes (including the Data Paths and AbstractBrowseComponents used for them)
    routes?: Route[];

    //todo - some way to add new tabs to existing browse pages

}