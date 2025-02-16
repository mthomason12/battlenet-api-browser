### Changelog

#### Current-Dev (awaiting release number)

#### v0.3.22-dev

- Removed per-os tags from github release uploads.

#### v0.3.21-dev

- Added RPM build for Github
- Added license to package.json for Github's Linux RPM builder.

#### v0.3.10-dev

- Added preliminary build scripts for Linux and OSX

##### New Features

- Added all remaining data to Character Profiles


#### v0.3.9-dev

- Added build-zip and github-make-release scripts.


#### v0.3-dev

##### Upgrade Notes

- Storage of API key has changed, if upgrading you'll need to re-input your Client ID and Secret.

##### New Features

- Added Character Profiles data
- Added Guild Profiles data
- Added a simple query cache
- The command "bna" can now be used in the browser console for debugging purposes
- Extension support (partial)
- "Rebuild Index" item available on tools tab where applicable
- Settings allows changing connection type if additional types are available (requires extensions)
- npm run electron-make-deb now makes a .deb on compatible Linux systems (note - this is currently untested)
- npm run electron-make-win now makes a Windows setup.exe (again, currently untested)
- policy.jsonc can be used to override settings and disable parts of the settings UI at runtime. See public/policy.example.jsonc for commented example

##### Bug Fixes

- Graceful error message if browser is unable to run Angular or doesn't have IndexedDB.
- Records now delete properly when using the tools "clear this data type" button.
- API 404s no longer hang jobs in the job queue.
- Rendering of tables within tables in "(Data)" view has been reduced to reduce complexity hanging browsers
- OAuth now works properly on Electron


#### v0.2-dev

##### New features

- Added items database.  New items can be added to the local items table by running searches.
- Indexes for each data type are now cached.


#### v0.1-dev

Initial in-development preview