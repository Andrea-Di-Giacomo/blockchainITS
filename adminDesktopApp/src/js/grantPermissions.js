multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
const output=require("./../util/util");


function checkPermissions() {
    let address = document.getElementById("input").value;
    if (address.value !== "") {
        console.log(address.value);
        let permessi_presenti = [];
        multichainNodeAsync.listPermissionsAsync({permissions: "all", addresses: address, verbose: true}).then(res => {
            for (let permesso in res) {
                permessi_presenti.push(res[permesso].type);
            }
            creaCheckBoxPermessi(permessi_presenti);
        }).catch(err => {
            console.log(err);
            output.removeElements(document.querySelectorAll("#div_bottoni"));
        });
    }
}
function creaCheckBoxPermessi(permessi_da_eliminare){
    let bottoni=document.getElementsByClassName('buttons');
    if(bottoni.length!==0){
        output.removeElements(document.querySelectorAll('#div_bottoni'));
    }
    let permessi=["connect","send","receive","create","issue","mine","activate","admin"];
    if(permessi_da_eliminare.length>0){
        permessi = permessi.filter(x => !permessi_da_eliminare.includes(x));
    }
    let div=document.getElementsByClassName("checkBoxes")[0];
    let div_button=document.createElement("div");
    div_button.id="div_bottoni";
    for(let i=0;i<permessi.length;i++) {
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", permessi[i]);
        checkbox.className="buttons";
        checkbox.setAttribute("name", "tipoPermesso");
        let labelConnect = document.createElement("label");
        labelConnect.innerHTML = permessi[i];
        div_button.appendChild(labelConnect);
        div_button.appendChild(checkbox);
    }
    div.appendChild(div_button);
}
function grantPermissions() {
    let perms = getCheckedBoxes();
    console.log(perms);
    let address = document.getElementById("input").value;
    multichainNodeAsync.grantAsync({addresses: address, permissions: perms}).then(res => {

        output.removeElements(document.querySelectorAll(".risultato"));
        multichainNodeAsync.publishAsync({
            stream: 'permessi',
            key: address,
            data: {json: {address: address, nuovo_permesso: perms, timestamp: Math.floor(new Date() / 1000)}}
        }).then(res => {
            alert("Permesso assegnato al nodo "+ address); //crea una nuova funzione per output pretty
            location.href='grantPermissions.html'
        });
    }).catch(err => {
        console.log("Non è stato possibile assegnare il nuovo permesso al nodo");
    });
}
function getCheckedBoxes() {
    const checkedBoxes = document.querySelectorAll('input[name=tipoPermesso]:checked');
    console.log(checkedBoxes);
    let args = '';
    for (let i = 0; i < checkedBoxes.length; i++) {
        if (i === checkedBoxes.length - 1) {
            args += checkedBoxes[i].id;
        } else {
            args += checkedBoxes[i].id + ",";
        }
    }
    return args;
}
