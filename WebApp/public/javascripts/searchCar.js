$("#searchForm").on("submit",function (ev) {
    ev.preventDefault();
    send_data(document.getElementById("input").value);
});
function incidenti() {
    $.ajax({
        url: '/car/incidenti/'+document.getElementById("input").value, //crea endpoint per gli incidenti
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (result,resp,xhr) {
            if(xhr.status===204) {
                alert("Non sono presenti incidenti registrati nella piattaforma.");
            }
            else {
                document.getElementById("col-dx").style.display="block";
                document.getElementById("riparazioni").innerHTML="";
                let res = JSON.parse(xhr.responseText);
                console.log(res);
                res.sort((a,b) => (a.blocktime > b.blocktime) ? 1 : ((b.blocktime > a.blocktime) ? -1 : 0));
                document.getElementById("interventi").style.display = "block";
                let div_incidenti=document.getElementById("incidenti");
                let table_header=["Data incidente","Indennizzo","Assicurazione","Sita in"];
                for(let k =0;k<res.length;k++){
                    let div_intervento=document.createElement("div");
                    div_intervento.className="incidente";
                    let strong=document.createElement("strong");
                    strong.innerHTML=(k+1).toString()+"° Incidente".bold();
                    let h2=document.createElement("h2");
                    h2.appendChild(strong);
                    div_intervento.appendChild(h2);
                    let table=document.createElement("table");
                    table.className="table table-striped table-bordered";
                    let thead=document.createElement("thead");
                    thead.className="thead-dark";
                    let tr_head=document.createElement("tr");
                    for (let header in table_header){
                        let th=document.createElement("th");
                        th.innerHTML=table_header[header];
                        tr_head.appendChild(th);
                    }
                    thead.appendChild(tr_head);
                    table.appendChild(thead);
                    let tbody=document.createElement("tbody");
                    table.appendChild(tbody);
                    let row = tbody.insertRow(0);
                    row.insertCell(0).innerHTML=res[k].keys[3];
                    row.insertCell(1).innerHTML=res[k].data.json.indennizzo+" €";
                    row.insertCell(2).innerHTML=res[k].data.json.assicurazione;
                    row.insertCell(3).innerHTML=res[k].data.json.locazione;


                    let tableRip=document.createElement("table");
                    tableRip.className="table table-striped table-bordered";
                    let theadRip=document.createElement("thead");
                    theadRip.className="thead-dark";
                    let tr_headRip=document.createElement("tr");
                    let thRip=document.createElement("th");
                    thRip.innerHTML="Descrizione dell'incidente";
                    tr_headRip.appendChild(thRip);
                    theadRip.appendChild(tr_headRip);
                    tableRip.appendChild(theadRip);
                    let tbodyRip=document.createElement("tbody");
                    tableRip.appendChild(tbodyRip);
                    row = tbodyRip.insertRow(0);
                    row.insertCell(0).innerHTML=res[k].data.json.descrizione;
                    div_intervento.appendChild(table);
                    div_intervento.appendChild(tableRip);
                    div_incidenti.appendChild(div_intervento);
                    let btn=document.getElementById("btnIncidenti");
                    btn.onclick=send_data;
                    btn.innerHTML="<h5>Torna agli interventi</h5>"
                    btn.className="link";
                    btn.id="btnIncidenti"
                }
            }
        },
        error: function(xhr, resp, text) {
            alert("Servizio non disponibile");
        }
    });
}

function send_data(){
    let targa=document.getElementById("input").value;
    $.ajax({
        url: '/interventi/'+targa,
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (result,resp,xhr) {
            if (xhr.status === 204) {
                alert("Il veicolo ricercato non è presente");
                document.getElementById("col-dx").style.display = "none";
            } else {
                document.getElementById("col-dx").style.display = "block";
                document.getElementById("incidenti").innerHTML = "";
                let btn = document.getElementById("btnIncidenti");
                btn.onclick = incidenti;
                btn.innerHTML = "<h5>Verifica la presenza di incidenti</h5>";
                btn.className = "link";
                btn.id = "btnIncidenti";
                let numProprietari = [];
                let res = JSON.parse(xhr.responseText);
                res.sort((a, b) => (a.data.json.chilometraggio > b.data.json.chilometraggio) ? 1 : ((b.data.json.chilometraggio > a.data.json.chilometraggio) ? -1 : 0));
                document.getElementById("interventi").style.display = "block";
                document.getElementById("marca").innerText = res[0].data.json.marca;
                document.getElementById("modello").innerHTML = res[0].data.json.modello;
                document.getElementById("data_assicurazione").innerHTML = res[0].data.json.scadenza_ass;
                document.getElementById("polizze").innerHTML = res[0].data.json.polizze;
                for (let elems in res) {
                    numProprietari.push(res[elems].data.json.proprietario)
                }
                const proprietariUnici = new Set(numProprietari);
                document.getElementById("num_prop").innerHTML = proprietariUnici.size.toString();
                try {
                    if (res[0].keys[2] === "IMMATRICOLAZIONE") {
                        document.getElementById("data_imm").innerHTML = res[0].keys[3];
                        document.getElementById("cilindrata").innerHTML = res[0].data.json.cilindrata;
                        document.getElementById("cavalli").innerHTML = res[0].data.json.cavalli;
                    } else {
                        document.getElementById("data_imm").style.display = "none";
                        document.getElementById("cilindrata").style.display = "none";
                        document.getElementById("cavalli").style.display = "none";
                    }
                    document.getElementById("riparazioni").innerHTML = "";
                    let div_interventi = document.getElementById("riparazioni");
                    let table_header = ["Data intervento", "Tipo di intervento", "Chilometraggio rilevato", "Società", "Sita in", "Categoria"];
                    for (let k = 0; k < res.length; k++) {
                        let div_intervento = document.createElement("div");
                        div_intervento.className = "intervento";
                        let strong = document.createElement("strong");
                        strong.innerHTML = (k + 1).toString() + "° Intervento".bold();
                        let h2 = document.createElement("h2");
                        h2.appendChild(strong);
                        div_intervento.appendChild(h2);
                        let table = document.createElement("table");
                        table.className = "table table-striped table-bordered";
                        let thead = document.createElement("thead");
                        thead.className = "thead-dark";
                        let tr_head = document.createElement("tr");
                        for (let header in table_header) {
                            let th = document.createElement("th");
                            th.innerHTML = table_header[header];
                            tr_head.appendChild(th);
                        }
                        thead.appendChild(tr_head);
                        table.appendChild(thead);
                        let tbody = document.createElement("tbody");
                        table.appendChild(tbody)
                        let row = tbody.insertRow(0);
                        row.insertCell(0).innerHTML = res[k].keys[3];
                        row.insertCell(1).innerHTML = res[k].keys[2];
                        if (res[k].data.json.chilometraggio === undefined)
                            row.insertCell(2).innerHTML = 0;
                        else
                            row.insertCell(2).innerHTML = res[k].data.json.chilometraggio;
                        row.insertCell(3).innerHTML = res[k].data.json.societa;
                        row.insertCell(4).innerHTML = res[k].data.json.locazione;
                        row.insertCell(5).innerHTML = res[k].data.json.tipoUtente;


                        let tableRip = document.createElement("table");
                        tableRip.className = "table table-striped table-bordered";
                        let theadRip = document.createElement("thead");
                        theadRip.className = "thead-dark";
                        let tr_headRip = document.createElement("tr");
                        let thRip = document.createElement("th");
                        thRip.innerHTML = "Elenco delle riparazioni eseguite";
                        tr_headRip.appendChild(thRip);
                        theadRip.appendChild(tr_headRip);
                        tableRip.appendChild(theadRip);
                        let tbodyRip = document.createElement("tbody");
                        tableRip.appendChild(tbodyRip);
                        for (let riparazione in res[k].data.json.riparazioni) {
                            let row = tbodyRip.insertRow(0);
                            row.insertCell(0).innerHTML = res[k].data.json.riparazioni[riparazione];
                        }
                        div_intervento.appendChild(table);
                        div_intervento.appendChild(tableRip);
                        div_interventi.appendChild(div_intervento);
                    }
                } catch (e) {
                    document.getElementById("data_imm").innerHTML="Dato non presente";
                    document.getElementById("cilindrata").innerHTML ="Dato non presente";
                    document.getElementById("cavalli").innerHTML = "Dato non presente";
                    document.getElementById("num_prop").innerHTML="Dato non presente";
                }
            }
        },
        error: function(xhr, resp, text) {
            alert("Servizio non disponibile");
        }
    });
}

$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("Targa")!==null) {
        document.getElementById("input").value=urlParams.get("Targa");
        send_data(urlParams.get('Targa'))
    }
});

