multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
const output=require("./../util/util");
function queryStream() {
    //preleva il nome dell input della tendina
    let stream = document.getElementById("dropdown").value;
    let key = document.getElementById("keyStream").value;
    console.log(key);
    key = key.split("-");
    if (key[0]==="") {
        multichainNodeAsync.listStreamItems({stream: stream, count:100000}).then(res => {
            output.removeElements(document.querySelectorAll(".risultato"));
            if (res.length === 0) {
                output.putRawOutput("", {Errore: "Non è presente alcun dato nella stream."})
            } else {
                output.jsonOutput(res);
            }
        }).catch(err => {
            alert("Servizio non disponibile. Riprova più tardi.");
        })
    } else {
        for (let i = 0; i < key.length; i++)
            key[i] = key[i].toUpperCase();

        multichainNodeAsync.listStreamQueryItems({stream: stream, query: {keys: key},count:100000}).then(res => {
            output.removeElements(document.querySelectorAll(".risultato"));
            if (res.length === 0) {
                output.putRawOutput("", {Errore: "Non è presente alcun dato sulla base della chiave fornita all'interno della stream."})
            } else {
                output.jsonOutput(res);
            }
        }).catch(err => {
            alert("Servizio non disponibile. Riprova più tardi.");
        })
    }
}

function loadData(){
    let div=document.getElementById("dropdownDiv");
    let dropdown=document.createElement("select");
    dropdown.id="dropdown";
    div.appendChild(dropdown);
    multichainNodeAsync.listStreamsAsync().then(res=>{
        for(let i=0;i<res.length;i++){
            dropdown.options[dropdown.options.length] = new Option(res[i].name, res[i].name);
            console.log(res[i].name);
        }
        let p=document.createElement("p");
        let inputText=document.createElement("input");
        inputText.setAttribute("type","text");
        inputText.required=true;
        inputText.placeholder="Inserisci la chiave di ricerca della stream";
        inputText.setAttribute("id","keyStream");
        p.appendChild(inputText);
        div.appendChild(p);
    })
}
