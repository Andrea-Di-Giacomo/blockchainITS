const { app, BrowserWindow } = require('electron');
const builder=require("./src/js/builderWindow");
const ipcMain=require('electron').ipcMain;
function createWindow () {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });
        // and load the index.html of the app.
        win.loadFile('index.html')

}
app.on('ready', createWindow);


function createWindowCustom (filePath) {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        },

    });
    win.loadFile(filePath)

}
ipcMain.on('load-home',(event,arg)=>{
    builder('index.html');
});
//
ipcMain.on('load-blockchain',(event,arg)=>{
    builder(__dirname+'/src/template/blockchainInfo.html');
});
ipcMain.on('info-blockchain',(event,arg)=>{
    builder(__dirname+'/src/template/specific_info.html');
});
ipcMain.on('grantPermissions',(event,arg)=>{
    builder(__dirname+'/src/template/grantPermissions.html');
});
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});

