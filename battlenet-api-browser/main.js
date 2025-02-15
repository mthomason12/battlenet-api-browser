const { app, BrowserWindow, protocol } = require('electron/main')


let win;

const rootFile = 'dist/battlenet-api-browser/browser/index.html';

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile(rootFile);

}

/*
app.on('open-url', (event, url) => {
  if (!url.startsWith("http://localhost:4200/auth-callback")) return;
  event.preventDefault();
  win.loadFile(rootFile);
});*/

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  } 
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow();

  protocol.handle('http', (request) => {
    return new Response('<h1>Redirecting...</h1>',{
      headers: { 
        'content-type': 'text/html',
        'location': url.pathToFileURL(path.join(process.resourcesPath, 'app.asar', rootfile)).toString()
      },
      status: 301
    });
  });
})



