const { app, BrowserWindow, globalShortcut } = require('electron')
const url = require("url");
const path = require("path");


let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      sandbox: true,
      allowRunningInsecureContent: true

    }
  })
  // // mainWindow.$ = mainWindow.jQuery = require('jquery');
  mainWindow.setMenu(null);
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', () => {
  globalShortcut.register('CmdOrCtrl+R', () => { });
  createWindow();
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})