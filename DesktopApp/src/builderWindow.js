const {BrowserWindow} = require('electron');
function createWindowCustom (filePath) {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },

    });
    win.loadFile(filePath)

}
module.exports=createWindowCustom;
