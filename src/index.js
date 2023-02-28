const { app, BrowserWindow } = require('electron');
const path = require('path'); // node.js API �� path �M��
const globalShortcut = require('electron').globalShortcut; // ����ֱ���
const Tray = require('electron').Tray; // �t�γq����
const Menu = require('electron').Menu; // ���ε{�����


function createTray(win) {

  const iconPath = path.join(__dirname, './imgs/tray.png');
  const tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
      {
          label: 'User 4', click: () => {
              win.show();
              win.webContents.send('switch-cat', 4);
          }
      },
      {
          label: 'User 5', click: () => {
              win.show();
              win.webContents.send('switch-cat', 5);
          }
      },
      {
          label: 'User 6', click: () => {
              win.show();
              win.webContents.send('switch-cat', 6);
          }
      },
      {
          label: 'Hide',
          click: () => win.hide() // ���� �ୱ�߫}
      },
      {
          label: 'Quit',
          click: () => {
              app.isQuiting = true;
              app.quit();
          }
      }
  ])
  tray.setToolTip('Switch')
  tray.setContextMenu(contextMenu);

  tray.on('click', () => win.show())

  return tray;
}




// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 350,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    show: false,      // ����� BrowserWindow
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  return mainWindow;

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  const win = createWindow();
  createTray(win);

      [1, 2, 3].map(number => {
            globalShortcut.register(`CommandOrControl+${number}`, () => {
                win.webContents.send('switch-cat', number); // Ĳ�o  preload.js ���� ipcRenderer.on('switch-cat' �ƥ�
                win.show();  // Shows and gives focus to the window.
            })
        })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


app.on('web-contents-created', (event, contents) => {
  contents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['style-src \'self\' \'unsafe-inline\'']
      }
    })
  })
})

