# Battle&#46;NET API Browser

[SPA](https://en.wikipedia.org/wiki/Single-page_application) client for the [Battle.net API](https://develop.battle.net/), written in [Angular](https://angular.dev).

This is a work in progress, many parts of the API are not implemented yet and only have a placeholder folder icon.

![screenshot of the Covenants API viewing the Kyrian covenant](doc/images/screenshot-kyrian.png)

## Requirements

### Development and Build

- Node v22.12.0, not tested on earlier versions.  

### Runtime

Tested on Chrome (132.0.6834.110), Firefox (113.0.3), and Edge (132.0.2957.127) running from a local webserver.

Also includes WIP build scripts for a standalone Electron version.

#### Battle&#46;net Client Registration

Note: You will need to provide your own Battle&#46;net API Key and secret. 
You can get this from the [Battle.net Developer Portal](https://develop.battle.net/access/clients)

When registering your client, you'll need to provide a redirect URL.  If running locally under the defaults, this will be http://localhost:4200/auth-callback

Check "I do not have a service URL for this client"

One item on the [roadmap](#roadmap) is to provide a public API proxy for use by this app.

## Usage

The vast majority of data is left as-is from the Battle.net API.  

However, some things are tweaked for usability, and some are combined.  

For example, exporting "achievements" as JSON will give you an object with both "items" and "details" arrays, with "items" containing the data from getAchievementIndex and "details" containing the individual items from getAchievement.  get....Media calls are automatically run after the applicable query, with the results being appended to a mediaData property on the original item.  The focus is on making it easier for end users, not on matching the API layout 1:1 (if you want that, you can just call the API directly yourself ;) 

## Known Issues

There is currently very little in the way of error checking and handling.  
Any problem with an API call tends to just fail silently other than an error message in the browser console.  The Electron build is only checked intermittently and may be broken at any time (will be adding releases of this soon to provide a ready-built version).

Currently everything is hard-coded to the US region

## Roadmap

- Finish adding API endpoints
- JSON import
- Search function
- Connect to a public API server without needing an API key