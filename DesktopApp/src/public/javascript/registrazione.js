// Inserisce le province richieste al server nel dropdown
let $ = require("jquery");
let multichainRequest=require('./src/multichain_node_link');
const remote=require('electron').remote;
let rimraf=require("rimraf");


function fillDropdownProvincia(){
    let dropdown = $('#drop');
    const url = 'https://localhost:3443/api/province';
    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.nome).text(entry.nome));
        });
    });
}

//Controllo che i campi password e conferma password contengano la stessa pass
function check(input) {
    if (input.value !== document.getElementById('psw').value) {
        input.setCustomValidity('Le password non coincidono');
    } else {
        input.setCustomValidity('');
    }
}
$("#form-signup").on("submit",function (ev) {
    ev.preventDefault();
    let tipoSocieta = document.querySelector('input[name="tipoUtente"]:checked').value;
    let documento_titolare = document.getElementById('documento_titolare');
    let documento_societa = document.getElementById('documento_societa');
    let address=undefined;
    while(address===undefined)
        address=multichainRequest.exec();
    var stringa = {
        nome: $("#nome").val(),
        cognome: $("#cognome").val(),
        psw: $("#psw").val(),
        email: $("#email").val(),
        documento_titolare: documento_titolare.src,
        nome_societa: $("#nome_societa").val(),
        documento_societa: documento_societa.src,
        tipoSocieta: tipoSocieta,
        provincia: $("#drop").val(),
        comune: $("#dropComuni").val(),
        address:address
    };
    $.ajax({
        url: 'https://localhost:3443/api/signup',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(stringa),
        contentType: "application/json;charset=UTF-8",
        success: function (resp) {
            console.log("Inzio l'exec");
            console.log("Concludo l'exec");
            closeRegForm();
            showJumbo();
        },
        error: function (xhr, resp) {
            if (xhr.status == 400) {
                alert("Email già in uso");
            }else{
                alert("Servizio non disponibile")
            }
            let organizzazione=remote.getGlobal('sharedObject').prop1[2];
            rimraf.sync(process.env.APPDATA+"\\"+'Multichain_'+organizzazione);
        }
    });
});


//Nasconde il form
    function closeRegForm() {
        document.getElementById("form-signup").style.display = "none";
    }

//Mostra jumbo di avvenuta registrazione

function mandaProvincia(){
    let province = document.getElementById("drop");
    $.ajax({
        url: 'https://localhost:3443/api/comuni/' + province.value,
        type : "GET",
        dataType : 'json',
        success : function(result,resp,xhr) {
            var comuni = JSON.parse(xhr.responseText);
            let dropdown = $("#dropComuni");
            dropdown.empty();
            dropdown.prop('selectedIndex', 0);
            $.each(comuni, function (key, entry) {
                dropdown.append($('<option></option>').attr('value', entry.comune).text(entry.comune));
            });


        },
        error: function(xhr, resp, text) {
            let response = xhr.responseText;
            alert(response);
        }
    })
}
function showJumbo(){
        document.getElementById("jumbo").style.display="block";

}
// Conversione dell'immagine in base64
function readURL(input,id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(id)
                .attr('src', e.target.result);
        };

        reader.readAsDataURL(input.files[0]);


    }
}
