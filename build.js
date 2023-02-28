const path = require('path');
const builder = require('electron-builder');

builder.build({
    projectDir: path.resolve(__dirname), 
    win: ['nsis', 'portable'],  
    config: {
        "appId": "com.whiteSHADOW1234.electron.switch",
        "productName": "Switch",
        "directories": {
            "output": "build/win"
        },
        "win": {
            "icon": path.resolve(__dirname, './src/imgs/tray.png'),
        },
        "mac": {
            "icon": path.resolve(__dirname, './src/imgs/tray.png'),
        },
        "linux": {
            "icon": path.resolve(__dirname, './src/imgs/tray.png'),
        },
    },
})
.then(
    data => console.log(data),
    err => console.error(err)
);
