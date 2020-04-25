const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')
const path = require('path')

require('electron-reload')(__dirname);
let mainWindow
// let framelessWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    frame: true,
    width: 1260,
    height: 768,
    icon: __dirname + '/src/assets/ivoraicon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.setMenu(null);

  // mainWindow.loadFile('src/secondPage_1.html')
  mainWindow.loadFile('src/Index.html')
  setTimeout(() => {
    // mainWindow.loadFile('src/AacTacoption.html')
    mainWindow.loadFile('src/mainDashBoard.html')
  }, 3000)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on('gotoAacTacoptionPage', () => {
  console.log('trying to open window');
  mainWindow.loadFile('src/AacTacoption.html');
});

//second page
ipcMain.on('gotolatlngEntryPage', () => {
  console.log('trying to open window');
  mainWindow.loadFile('src/latlngEntry.html');
});

// third page
ipcMain.on('gotomapchoosePage', () => {
  console.log('trying to open window');
  mainWindow.loadFile('src/mapchoose.html');
});

// gotoDashBoard mainDashBoard.html 
ipcMain.on('gotoDashBoard', () => {
  console.log('trying to open windowwwwwwwwwwwww');
  mainWindow.loadFile('src/mainDashBoard.html');
});

ipcMain.on('back-to-previous-window', () => {
  console.log('trying to open window');
  mainWindow.loadFile('src/Index.html');
});


ipcMain.on('gotoMarkDeadZonePage', () => {
  console.log('trying to open window');
  mainWindow.loadFile('src/markDeadZone.html');
});


ipcMain.on('gotoMarkAssetZonePage', () => {
  console.log('trying to open window');
  mainWindow.loadFile('src/markAssetZone.html');
});
app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


