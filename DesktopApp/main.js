const { app, BrowserWindow } = require('electron');
const builder=require("./src/builderWindow");
const execSync = require('child_process').execSync;
const ipcMain=require('electron').ipcMain;
const fs=require("fs");
const performance=require('performance-now');
global.sharedObject = {prop1: process.argv}
function createWindowIndex () {
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



function exec() {
    console.warn("ASa");
    console.log("1111111111");
    times=[];
    for(var i=12000;i<22000;i++) {
        var t0 = performance();
        let commands = "multichain-cli -datadir=C:\\Users\\Andrea\\AppData\\Roaming\\Multichain_test -port=10455 -rpcport=10454 tesi liststreams";
        try {
            var y=execSync(commands);
            var x=e.stdout.toString();
            y=x;
        }catch (e){
            if (e.stdout.toString().split(" ")[27] !== undefined) {
                x=e.stdout.toString().split(" ")[27];
                let commands = "multichain-cli tesi grant "+ x+ " connect,send,receive";
                try {
                    execSync(commands);
                }catch (e) {
                    console.warn("YOYO");
                }
            } else {
                console.log(e);
            }
        }
        times.push(performance() - t0);
        fs.appendFileSync('C:\\Users\\Andrea\\Desktop\\100k.csv', parseInt(performance() - t0) + "\n");
    }

    console.log("FINE")
}

exec();



app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});
