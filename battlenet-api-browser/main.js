const { app, BrowserWindow, protocol } = require('electron/main')
const fs = require('node:fs');
const path = require('node:path');
const url = require('url');
const started = require('electron-squirrel-startup');

let win;

const rootFile = 'dist/battlenet-api-browser/browser/index.html';
console.log("file: "+rootFile);
const absRoot = path.resolve(rootFile);
console.log("absFile: "+absRoot);

//quit if this is a squirrel startup event
if (started) app.quit();

/**
 * createWindow function to create our main window
 */
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  /**
   * Catch load failures (e.g. Electron's refresh, which doesn't include index.html on the end)  
   * and redirect them to the index
   */
  win.webContents.on('did-fail-load', () => { 
    win.loadFile(rootFile); 
  });


  /**
   * Catch redirect events from oauth
   */
  win.webContents.on('will-redirect', (event)=>{
    if (event.url.startsWith("http:")) {
      //console.log("intercepting redirect "+event.url);
      event.preventDefault();  
      const thisUrl = new URL(event.url);
      const params = new URLSearchParams(thisUrl.search);   
      const code = params.get('code');
      const state = params.get('state');
      win.loadFile(rootFile, {query : {code: code, state:state}}); 
    }
  });

  /**
   * Begin by loading our index file
   */
  win.loadFile(rootFile);
}

/**
 * Standard shutdown procedure for electron - terminate app when all windows are closed.
 * Otherwise the Electron process will just hang around window-less
 */
app.on('window-all-closed', () => {
  //except on OSX
  if (process.platform !== 'darwin') {
    app.quit()
  } 
});

/**
 * When application is activated, open the main window if we don't have one
 */
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})



/**
 * When application is ready, open the main window and set up our http interceptor
 */
app.whenReady().then(() => {
  createWindow();
})



