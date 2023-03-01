const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const { join } = require('path'); // node.js API 的 path 套件
const { globalShortcut } = require('electron'); // 全域快捷鍵
const { Tray } = require('electron'); // 系統通知區
const { Menu } = require('electron'); // 應用程式選單
const AutoLaunch = require('auto-launch');


function createTray(win) {

  const iconPath = join(__dirname, './imgs/tray.png');
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
          click: () => win.hide() // 隱藏 桌面貓咪
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
      preload: join(__dirname, 'preload.js'),
    },
    frame: false,
    transparent: true,
    autoHideMenuBar: true,
    show: false,      // 不顯示 BrowserWindow
  });

  // and load the index.html of the app.
  mainWindow.loadFile(join(__dirname, 'index.html'));
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
  let autoLaunch = new AutoLaunch({
      name: 'SWITCH!',
      path: app.getPath('exe'),
  });

  autoLaunch.isEnabled().then((isEnabled) => {
      if (!isEnabled) autoLaunch.enable();
  });

      [1, 2, 3].map(number => {
            globalShortcut.register(`CommandOrControl+${number}`, () => {
                win.webContents.send('switch-cat', number); // 觸發  preload.js 中的 ipcRenderer.on('switch-cat' 事件
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


app.on('web-contents-created', (_event, contents) => {
  contents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['style-src \'self\' \'unsafe-inline\'']
      }
    })
  })
})


