This folder is intended for extensions to the main application, allowing for easier maintenance of modified codebases.

Extensions need to be descendants of AbstractExtension, and return a valid ExtensionRegistration from their getRegistration() method.