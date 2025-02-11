## Changelog

#### Current-Dev

##### Bug Fixes
- Graceful error message if browser is unable to run Angular or doesn't have IndexedDB.
- Records now delete properly when using the tools "clear this data type" button.
- API 404s no longer hang jobs in the job queue.
- "Rebuild Index" item available on tools tab where applicable

#### v0.2d

##### New features
- Adds the items database.  New items can be added to the local items table by running searches.
- Indexes for each data type are now cached.