const removeElements = (elms) => elms.forEach(el => el.remove());

function putRawOutput(titolo,res){
    if(titolo!=="") {
        document.title = titolo;
        let h1 = document.createElement("h1");
        h1.className = "display-4";
        h1.innerHTML = titolo;
        h1.id="titolo-display";
        document.body.appendChild(h1);
    }
    let output=document.createElement("div");
    output.className="risultato";
    for(const element in res){
        let etichetta = document.createElement("em");
        etichetta.innerHTML=element;
        etichetta.className="d-xl-flex flex-fill justify-content-xl-center";
        etichetta.style.color="rgb(31,0,222)";
        let valore=document.createElement("p");
        valore.innerHTML = JSON.stringify(res[element]);
        valore.className="border-info d-xl-flex justify-content-xl-center";
        output.appendChild(etichetta);
        output.appendChild(valore)
    }
    document.getElementsByClassName("main")[0].appendChild(output);
}
function createTable(res,container){
    console.log(res);
    var body = document.body,
        tbl  = document.createElement('table');
    tbl.style.width  = '100px';
    tbl.style.border = '1px solid black';
    for(let i in res){
        var tr = tbl.insertRow();
        var td1 = tr.insertCell();
        td1.appendChild(document.createTextNode(i));
        td1.style.border = '1px solid black';
        var td2 = tr.insertCell();
        td2.appendChild(document.createTextNode(res[i]));
        td2.style.border = '1px solid black';
    }
    if(container===true)
        document.getElementsByClassName("container")[0].appendChild(tbl);
    else
        body.appendChild(tbl);
}
function jsonOutput(res){
    let risultato=document.createElement("pre");
    risultato.className="risultato";
    risultato.innerHTML=JSON.stringify(res,undefined,2);
    document.getElementsByClassName("main")[0].appendChild(risultato);

}

module.exports={removeElements,putRawOutput,createTable,jsonOutput};
