$=require('jquery');
multichainNodeAsync=require('./../multichain-node').multichainNodeAsync;
$('#immatricolazioneForm').on('submit',function (ev){
    ev.preventDefault();
    let marca=$("#marca").val();
    let modello=$("#modello").val();
    let targa=$("#targa").val();
    let telaio=$("#telaio").val();
    let proprietario=$("#proprietario").val();
    let cilindrata=$("#cilindrata").val();
    let cavalli=$("#cavalli").val();
    let data=dataCorrente();
    let tipoRiparazione="IMMATRICOLAZIONE";
    multichainNodeAsync.publishAsync({
        stream: 'riparazioni', //l'address lo si ottiene dal publisher dello stream item
        key: [targa.toUpperCase(),telaio.toUpperCase(),tipoRiparazione.toUpperCase(),data],
        data: {json: {proprietario:proprietario.toUpperCase(),marca:marca.toUpperCase(),
                modello:modello.toUpperCase(),cilindrata:cilindrata,cavalli:cavalli,data: data}}
    }).then(res => {
        alert("Immatricolazione inserita");
    }).catch(err => {
        console.log("Servizio non disponibile.");
    });
});
function dataCorrente(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return (today);
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
            let selezione=document.getElementById("marca");
            let input=document.createElement("input");
            input.type="text";
            input.required=true;
            input.id="marca";
            input.className="form-control";
            input.placeholder="Marca";
            selezione.parentNode.replaceChild(input,selezione);
            let selezioneModello=document.getElementById("modello");
            let inputModello=document.createElement("input");
            inputModello.type="text";
            inputModello.required=true;
            inputModello.id="modello";
            inputModello.className="form-control";
            inputModello.placeholder="Modello";
            selezioneModello.parentNode.replaceChild(inputModello,selezioneModello);
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
