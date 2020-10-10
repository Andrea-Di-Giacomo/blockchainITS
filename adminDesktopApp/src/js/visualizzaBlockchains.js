const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const ipc = require('electron').ipcRenderer;

function caricaDati() {
    if (process.platform === "win32") {
        const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());
        return dirs(process.env.APPDATA+"\\MultiChain")
    }
}
blockchains=caricaDati();
blockchains = blockchains.filter(function(value, index, arr){

    return value!==".cli_history";

});
for (var i=0;i<blockchains.length;i++){
    let p=document.createElement("p");
    var btn = document.createElement("button");   // Create a <button> element
    btn.id=blockchains[i];
    btn.innerHTML = blockchains[i];
    btn.className="btn btn-info";
    btn.onclick=apriSpecificaBlockchain;
    p.appendChild(btn);
    document.body.appendChild(p);

}


function apriSpecificaBlockchain(){
    //localStorage.clear();
    localStorage.setItem("blockchain",this.id);
    ipc.send('load-blockchain');
    window.close()
}
