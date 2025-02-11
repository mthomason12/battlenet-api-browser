## Changelog

#### Current-Dev (awaiting release number)

#### New Features
- "Rebuild Index" item available on tools tab where applicable
- Added Character Profiles database
- Added a simple query cache
- npm run electron-make-deb now makes a .deb on compatible Linux systems (note - this is currently untested)
- npm run electron-make-win now makes a Windows setup.exe (again, currently untested)

##### Bug Fixes
- Graceful error message if browser is unable to run Angular or doesn't have IndexedDB.
- Records now delete properly when using the tools "clear this data type" button.
- API 404s no longer hang jobs in the job queue.

#### v0.2d

##### New features
- Added items database.  New items can be added to the local items table by running searches.
- Indexes for each data type are now cached.

#### v0.1d
Initial in-development preview