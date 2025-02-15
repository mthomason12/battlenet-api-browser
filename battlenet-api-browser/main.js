const { app, BrowserWindow, protocol } = require('electron/main')
const fs = require('node:fs');
const path = require('node:path');
const url = require('node:url');

let win;

const rootFile = 'dist/battlenet-api-browser/browser/index.html';
console.log("file: "+rootFile);
const absRoot = path.resolve(rootFile);
console.log("absFile: "+absRoot);

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
    win.loadURL(absRoot); 
  });

  /**
   * Begin by loading our index file
   */
  win.loadFile(absRoot);
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

  /** 
   * Catch HTTP requests and redirect them back to the local file root.
   * This is used to catch calls to the oauth callback (http://localhost:4200/)
   */
  protocol.handle('http', (request) => {
    console.log("Handling HTTP");
    return new Response('<h1>Redirecting...</h1>',{
      headers: { 
        'content-type': 'text/html',
        'location': url.pathToFileURL(absRoot)
      },
      status: 301
    });
  });
})



