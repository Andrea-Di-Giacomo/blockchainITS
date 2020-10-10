multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
const output=require("./../util/util");

function loadData(){
    let div=document.getElementById("dropdownDiv");
    let dropdown=document.createElement("select");
    dropdown.id="select";
    div.appendChild(dropdown);
    multichainNodeAsync.listStreamItemsAsync({stream:"consorzio",count:10000}).then(res=>{
        for(let i=0;i<res.length;i++){
            dropdown.options[dropdown.options.length] = new Option(res[i].data.json.societa, res[i].data.json.address);
        }
        let p=document.createElement("p");
        div.appendChild(p);
        document.getElementById("select").onchange=checkPermissions;

    });
}

function checkPermissions() {
    let address = document.getElementById("select").value;
    if (address.value !== "") {
        console.log(address);
        let permessi_presenti = [];
        multichainNodeAsync.listPermissionsAsync({permissions: "all", addresses: address, verbose: true}).then(res => {
            for (let permesso in res) {
                permessi_presenti.push(res[permesso].type);
            }
            let permessi=["connect","send","receive","create","issue","mine","activate","admin"];
            permessi_presenti = permessi.filter(x => !permessi_presenti.includes(x));
            creaCheckBoxPermessi(permessi_presenti);
        }).catch(err => {
            alert("Servizio non disponibile. Riprova più tardi.");
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

function revokePermissions(){
    let perms = getCheckedBoxes();
    console.log(perms);
    let address=document.getElementById("select").value;
    multichainNodeAsync.revokeAsync({addresses:address,permissions:perms}).then(res=> {
            alert("Permessi rimossi");
        location.href="revokePermissions.html";
        }
    ).catch(err=> {
        alert("Non è stato possibile rimuovere i permessi");
        location.href="revokePermissions.html";
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
