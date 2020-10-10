var cmd = require('child_process').exec;
const ipc = require('electron').ipcRenderer;


function exec() {
    commands = [];
    commands.push("multichain-util.exe create ");
    commands.push(document.getElementById("nome_BC").value);
    if (!document.getElementById('descrizione').value === undefined) {
        commands.push(" -chain-description " + document.getElementById('descrizione').value);
    }
    commands.push(" -target-block-time" + document.getElementById("tempo_blocchi").value);
    commands.push(" -maximum-block-size" + document.getElementById("dimensione_blocchi").value);
    commands.push(" -anyone-can-connect" + document.querySelector('input[name="permessi_connessione"]:checked').value);
    commands.push(" -anyone-can-send" + document.querySelector('input[name="permessi_invio"]:checked').value);
    commands.push(" -anyone-can-receive" + document.querySelector('input[name="permessi_ricezione"]:checked').value);
    commands.push(" -anyone-can-create" + document.querySelector('input[name="permessi_stream"]:checked').value);
    commands.push(" -anyone-can-issue" + document.querySelector('input[name="permessi_asset"]:checked').value);
    commands.push(" -anyone-can-mine" + document.querySelector('input[name="permessi_mining"]:checked').value);
    str_commands = commands.join("");
    if (process.platform === "win32") {
        res = cmdCommandWin(str_commands);
        if (res == false) {
            alert("Qualcosa è andato storto!")
        } else {
            alert("Blockchain creata!");
            ipc.send('load-home');
            window.close()

        }
    }
}
function cmdCommandWin(command){
    cmd(command,
        function (error, stdout, stderr) {
            return error === null;

            //alert('stdout: ' + stdout);
            //alert('stderr: ' + stderr);

        });
}
