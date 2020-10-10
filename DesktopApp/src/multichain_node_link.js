const execSync = require('child_process').execSync;
const ipc = require('electron').ipcRenderer;
const axios=require('axios');
const fs=require('fs');
const peers=require("./peerRequest").peers;
const remote=require('electron').remote;
let organizzazione=remote.getGlobal('sharedObject').prop1[2];
let port=remote.getGlobal('sharedObject').prop1[3];
let rpcPort=parseInt(port)-1;
let blockChainName=remote.getGlobal('sharedObject').prop1[4];
function exec() {
    fs.mkdirSync(process.env.APPDATA+"\\"+'Multichain_'+organizzazione);
        let commands = "multichaind.exe -datadir=" + process.env.APPDATA + "\\" + 'Multichain_' + organizzazione + " -port=" + port +
            " -rpcport=" + rpcPort + " " + blockChainName + "@" + peers[Math.floor(Math.random()*peers.length)];
        try {
            let code = execSync(commands);
        }catch (e) {
            if (e.stdout.toString().split(" ")[27] !== undefined) {
                return e.stdout.toString().split(" ")[27];
            } else {
                console.log(e);
                return undefined;
            }
        }
}


module.exports={exec};
