multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
const output=require("./../util/util");
function build(){
    var titolo = document.getElementById("titolo");
    titolo.innerHTML = "Piattaforma di gestione per la Blockchain: "+ localStorage.getItem("blockchain");
    var nota=document.getElementById("nota");
    nota.innerHTML="In produzione il nodo master dovrebbe essere sempre attivo, se si è in fase di sviluppo ricordarsi di attivarlo con il" +
        " comando multichcaind "+localStorage.getItem("blockchain")+" -daemon nel terminale.";
}


var show=function(){
    localStorage.setItem("action",this.id);
    window.open('specific_info.html',"","width=1280,height=720");

};
info=document.getElementsByClassName("btn btn-info dynamic");
Array.from(info).forEach(function(element) {
    element.onclick=show;
});



function newAddress() {
    multichainNodeAsync.getNewAddressAsync().then(res=>{
        alert("Ecco il nuovo address associato al tuo wallet: "+res)
    }).catch(err=>{
        alert("Servizio momentaneamente non disponibile")
    });
}
function show_info() {
    const action = localStorage.getItem("action");
    switch (action) {
        case "getInfo":
            multichainNodeAsync.getInfoAsync().then(res => {
                document.title = "Informazioni della Blockchain";
                output.createTable(res, false)
            }).catch(err => {
                console.log(err)
                output.putRawOutput("Informazioni della Blockchain", "Servizio momentaneamente non disponibile")
            });
            break;
        case "getParams":
            multichainNodeAsync.getBlockchainParamsAsync().then(res => {
                document.title = "Parametri della Blockchain";
                output.createTable(res, false)
            }).catch(err => {
                output.putRawOutput("Servizio momentaneamente non disponibile", err)
            });
            break;
        case "listStream":
            multichainNodeAsync.listStreamsAsync().then(res => {
                output.jsonOutput(res)
            }).catch(err => {
                output.putRawOutput("Servizio momentaneamente non disponibile", err)
            });
            break;
    }
}
