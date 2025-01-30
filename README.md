# Battle.NET API Browser

[SPA](https://en.wikipedia.org/wiki/Single-page_application) client for the [Battle.net API](https://develop.battle.net/), written in [Angular](https://angular.dev).

## Requirements

### Development and Build

- Node v22.12.0, not tested on earlier versions.  


### Runtime

Tested on Chrome, Chromium, Firefox, and Edge.  
Also includes build scripts for a standalone Electron version.

#### Battle.net Client Registration

Note: You will need to provide your own Battle.net API Key and secret. 
You can get this from the [Battle.net Developer Portal](https://develop.battle.net/access/clients)

When registering your client, you'll need to provide a redirect URL.  If running locally under the defaults, this will be http://localhost:4200/auth-callback

Check "I do not have a service URL for this client"

## Roadmap

- Finish adding API endpoints
- Option to retrieve all detail records (e.g. all the individual mounts) from a master (index) page.
- Option to background queue download of *all* data
- JSON import/export
- Search function
- Hostable proxy to allow use without an API key on every client