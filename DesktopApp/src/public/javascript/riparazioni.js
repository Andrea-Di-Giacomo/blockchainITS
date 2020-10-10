multichainNodeAsync=require("./../multichain-node").multichainNodeAsync;
$=require('jquery');
let num_riparazione=5;
let dropdownMarca;
let dropdownModello;
function aggiungiRiparazioni(){
    num_riparazione += 1;
    let container=document.getElementById("container");
    let row=document.createElement("div");
    row.className="row";
    let col_lg_2=document.createElement("div");
    col_lg_2.className="col lg-2";
    let p1=document.createElement("p");
    p1.innerHTML=num_riparazione+" riparazione";
    let col_lg_4_1=document.createElement("div");
    col_lg_4_1.className="col lg-4";
    let col_lg_4_2=document.createElement("div");
    col_lg_4_2.className="col lg-4";
    let input=document.createElement("input");
    input.type="text";
    input.className="riparazione";
    col_lg_2.appendChild(p1);
    row.appendChild(col_lg_2);
    row.appendChild(col_lg_4_1);
    col_lg_4_2.appendChild(input);
    row.appendChild(col_lg_4_2);
    container.appendChild(row);
}
$("#ripForm").on("submit",function (ev) {
    ev.preventDefault();
    let targa = document.getElementById("targa").value;
    let telaio = document.getElementById("telaio").value;
    let proprietario = document.getElementById("proprietario").value;
    let marca = document.getElementById("marca").value;
    let modello = document.getElementById("modello").value;
    let chilometri=document.getElementById("km").value;
    let riparazioni = [];
    let tipoRiparazione = document.querySelector('input[name="tipoRip"]:checked').value;
    if(tipoRiparazione==="Revisione"){
        let esito=document.querySelector('input[name="esito"]:checked').value;
        riparazioni.push(esito);
    }else{
        let riparazione_tmp = document.getElementsByClassName("riparazione");
        for (let i = 0; i < riparazione_tmp.length; i++) {
            if (riparazione_tmp[i].value !== "") {
                riparazioni.push(riparazione_tmp[i].value);
            }
        }
    }
    //console.log(targa, telaio, proprietario, marca, modello, chilometri, tipoRiparazione, riparazioni);
    addToStream(targa, telaio, proprietario, marca, modello, chilometri, tipoRiparazione, riparazioni)
});
function addToStream(targa,telaio,proprietario,marca,modello,chilometri, tipoRiparazione,riparazioni) {
    let data=dataCorrente();
    multichainNodeAsync.listStreamKeyItems({stream:"riparazioni",key:targa.toUpperCase()}).then(res=>{
        if(res.length>0) {
            if (chilometri > parseInt(res[res.length - 1].data.json.chilometraggio)) {
                multichainNodeAsync.publishAsync({
                    stream: 'riparazioni', //l'address lo si ottiene dal publisher dello stream item
                    key: [targa.toUpperCase(), telaio.toUpperCase(), tipoRiparazione.toUpperCase(), data],
                    data: {
                        json: {
                            proprietario: proprietario.toUpperCase(),
                            marca: marca.toUpperCase(),
                            modello: modello.toUpperCase(),
                            tipoRiparazione: tipoRiparazione.toUpperCase(),
                            riparazioni: riparazioni,
                            chilometraggio: chilometri
                        }
                    }
                }).then(res => {
                    alert("Riparazione inserita");
                }).catch(err => {
                    alert("Servizio non disponibile")
                });
            }else{
                console.log(res[res.length - 1].data.json.chilometraggio);
                alert("Il chilometraggio inserito è minore dell'ultimo registrato");
            }
        }
    }).catch(err=>{
        alert("Servizio non disponibile");
    })

}
function dataCorrente(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
   return (today);
}
function showRevisione(){
    document.getElementById("inputRevisione").style.display="block";
    document.getElementById("inputRiparazioni").style.display="none";
    document.getElementById("addRip").style.display="none";
    document.getElementsByName("esito")[0].required=true;
    document.getElementById("prima_rip").disabled=true;
}
function showRiparazione(){
    document.getElementById("inputRevisione").style.display="none";
    document.getElementById("inputRiparazioni").style.display="block";
    document.getElementById("addRip").style.display="block";
    document.getElementById("prima_rip").required=true;
    document.getElementById("prima_rip").disabled=false;
}
function loadMarche(){

    $.ajax({
        url: 'https://localhost:3443/api/car/marca',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (result,resp,xhr) {
            let marche = document.getElementById('marca');
            let marca=JSON.parse(xhr.responseText);
            $.each(marca,function (key,entry) {
                marche.options[marche.options.length] = new Option(entry.name, entry.name);
            })

        },
        error: function(xhr, resp, text) {
            switchSelectToInput()
        }
    });
}
function loadModelsByMakers() {
    let marca = document.getElementById("marca");
    $.ajax({
        url: 'https://localhost:3443/api/car/models/' + marca.value,
        type : "GET",
        dataType : 'json',
        success : function(result,resp,xhr) {
            let modelli = JSON.parse(xhr.responseText);
            let dropdown = document.getElementById("modello");
            $('#modello').empty();
            $.each(modelli,function (key,entry) {
                dropdown.options[dropdown.options.length] = new Option(entry.name, entry.name);
            })

        },
        error: function(xhr, resp, text) {
            let response = xhr.responseText;
            alert(response);
        }
    })
}
function loadCar() {
    let targa = document.getElementById("targa").value;
    multichainNodeAsync.listStreamKeyItemsAsync({stream: "riparazioni", key: targa.toUpperCase()}).then(res => {
        if (res.length > 0) {
            switchSelectToInput()
            document.getElementById("telaio").value = res[res.length - 1].keys[1];
            document.getElementById("marca").value = res[res.length - 1].data.json.marca;
            document.getElementById("modello").value = res[res.length - 1].data.json.modello;

        }else{
            document.getElementById("marca").parentNode.replaceChild(dropdownMarca,document.getElementById("marca"));
            document.getElementById("modello").parentNode.replaceChild(dropdownModello,document.getElementById("modello"));
        }
    }).catch(err => {
        if (err.code == "-703") {
            multichainNodeAsync.subscribeAsync({stream: "riparazioni"}).then(res => {
                loadCar()
            });
        } else {

            console.log(err)
        }
    });
}
function switchSelectToInput(){
    let selezione=document.getElementById("marca");
    dropdownMarca=selezione;
    let input=document.createElement("input");
    input.type="text";
    input.required=true;
    input.id="marca";
    selezione.parentNode.replaceChild(input,selezione);
    let selezioneModello=document.getElementById("modello");
    dropdownModello=selezioneModello;
    let inputModello=document.createElement("input");
    inputModello.type="text";
    inputModello.required=true;
    inputModello.id="modello";
    selezioneModello.parentNode.replaceChild(inputModello,selezioneModello);
}
