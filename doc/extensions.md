## Extensions

Extensions are compartmentalized sections of code, making it possible to add new features without having to maintain a complete codebase fork.  However, they still need to be compiled into the application.

### Loading an Extension

For an extension to be loaded, it should be added to the src/extensions/app.extensions.ts file.

```typescript
export const extensions: ExtensionList = [
    {
        name: "My Extension Display Name",
        class: MyExtensionClassName
    }
];
```

You'll also need to add an import for MyExtensionClassName at the top of the file.

### Extension Structure

At it's minimum, an extension consists of a single file containing the specified extension class, but can also contain additional files and classes.  The convention is to put all of these in a directory src/extensions/*myextension* where *myextension* is a unique name identifying your extension, preferably the same name as the class specified in app.extensions.ts

An extension class inherits from AbstractExtension (found in src/extensions/abstract/abstract-extension.ts), and at minimum needs to override getRegistration() to return a valid ExtensionRegistration.

```javascript
{
    name: string,     //the extension's name in a "friendly" form
    version?: string, //a version string identifying the extension version
    author?: string,  //your name
    website?: string, //website for the extension

    //anyt connection methods provided by the extension
    connections?:{
        name: string; //friendly name for the connection type 
        class: Type<APIConnection> //name of class to instantiate for this connection option - see below
        settingsComponent: Type<any> //name of component to add to settings dialog - see below
    }[];

    //additional tabs to add to the settings dialog - currently unused
    settingsPages?: {
        title: string; //title of page to add to the settings dialog for this extension
        class: Type<any>; //class of component to use for that page
    }

    extendsData: boolean; //whether the extension extends the data schema or not (currently unused)

    //additional routes (including the Data Paths and AbstractBrowseComponents used for them)
    routes?: Route[]; //(currently unused)
}
```

### Extension Connections
(todo)

### Extension Settings Pages
(todo)

### Extension Data
(todo)

### Extension Routes
(todo)


