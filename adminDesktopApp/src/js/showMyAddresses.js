multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
function build() {
    let addresses = [];
    let output = [];
    let div=document.getElementsByClassName("output")[0];
    let tab=document.getElementById("tab");
    multichainNodeAsync.getAddressesAsync({verbose: true}).then(res => {
        for (let indice in res)
            addresses.push(res[indice].address);
        for (let i = 0; i < addresses.length; i++) {
            let permessi = [];
            multichainNodeAsync.listPermissionsAsync({
                permissions: "all",
                addresses: addresses[i],
                verbose: true
            }).then(res => {
                    for (let permesso in res) {
                        permessi.push(res[permesso].type);
                    }
                    let row=tab.insertRow();
                    row.insertCell().innerHTML=addresses[i];
                    if(permessi.length===0)
                        row.insertCell().innerHTML="Non sono stati ancora assegnati dei permessi";
                    else
                    row.insertCell().innerHTML=JSON.stringify(permessi);
                }
            );
        }
    }).catch(err => {
        alert("Servizio non disponibile. Riprova più tardi.");
    });
}

