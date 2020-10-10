const {BrowserWindow} = require('electron');
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
module.exports=createWindowCustom;
