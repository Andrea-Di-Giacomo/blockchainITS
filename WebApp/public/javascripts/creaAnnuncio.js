$("#annuncioForm").on("submit",function (ev) {
    ev.preventDefault();
    upload_images()
});
function upload_images() {
    var selected_files = document.getElementById("imgs").files;
    let images_to_upload=[];
    for (let i = 0; i < selected_files.length; i++) {
        var fileReader = new FileReader();
        fileReader.onload = function (event) {
            images_to_upload.push(event.target.result);
            if (i == selected_files.length - 1) {
                send_data(images_to_upload);
            }
        };

        fileReader.readAsDataURL(selected_files[i]);
    }
}

function send_data(images_to_upload) {
    console.log(images_to_upload); //se non funziona metti stringify
    $.ajax({
        url: '/car/annuncio',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            targa: $("#targa").val(),
            marca: $("#marca").val(),
            modello: $("#modello").val(),
            cilindrata:$("#cilindrata").val(),
            cavalli:$("#cavalli").val(),
            alimentazione:$("#alimentazione").val(),
            provincia:$("#drop").val(),
            comune:$("#dropComuni").val(),
            telefono:$("#telefono").val(),
            anno:$("#anno").val(),
            prezzo:$("#prezzo").val(),
            chilometraggio:$("#chilometraggio").val(),
            cambio:$("#cambio").val(),
            descrizione:$("#descrizione").val(),
            immagini:images_to_upload
        }),
        contentType: "application/json;charset=UTF-8",
        success: function (result, resp, xhr) {
            alert("Annuncio inserito correttamente");
            location.href="/mainPage";

        },
        error: function (xhr, resp, text) {
            if(xhr.status===400) {
                alert("Il veicolo è gia presente");
            }
            if(xhr.status===500)
                alert(JSON.parse(xhr.responseText).data);
        }
    });
}
$("#targa").on("keyup",function (ev) {
    let targa=document.getElementById("targa").value;
    if(targa===""){
        document.getElementById("errore").style.display = "none";
        document.getElementById("dati").style.display="none";
        return;
    }
    if(targa.length<7){
        document.getElementById("errore").style.display = "none";
        document.getElementById("dati").style.display = "none";
    }
    if(targa.length===7) {
        $.ajax({
            url: '/car/' + document.getElementById("targa").value,
            type: 'GET',
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            success: function (result, resp, xhr) {

                if (xhr.status === 204) {
                    document.getElementById("errore").style.display = "block";
                    document.getElementById("dati").style.display = "none";
                } else {
                    fillData(xhr)

                }

            },
            error: function (xhr, resp, text) {
                let response = xhr.responseText;
                alert(response);
            }
        });
    }
});

function fillData(xhr){
    document.getElementById("dati").style.display="block";
    document.getElementById("errore").style.display="none";
    let info=JSON.parse(xhr.responseText);
    console.log(info);
    let marca=document.getElementById("marca");
    marca.value=info.immatricolazione.data.json.marca;
    marca.disabled=true;
    let modello=document.getElementById("modello");
    modello.value=info.immatricolazione.data.json.modello;
    modello.disabled=true;
    let cilindrata=document.getElementById("cilindrata");
    cilindrata.value=info.immatricolazione.data.json.cilindrata;
    cilindrata.disabled=true;
    let cavalli=document.getElementById("cavalli");
    cavalli.value=info.immatricolazione.data.json.cavalli;
    cavalli.disabled=true;
    let anno=document.getElementById("anno");
    anno.value=info.immatricolazione.keys[3];
    anno.disabled=true;
    let chilometraggio=document.getElementById("chilometraggio");
    chilometraggio.value=info.ultimo.data.json.chilometraggio;
    chilometraggio.disabled=true
}
function fillDropdownProvincia(){
    let dropdown = $('#drop');
    const url = '/api/province';
    $.getJSON(url, function (data) {
        $.each(data, function (key, entry) {
            dropdown.append($('<option></option>').attr('value', entry.nome).text(entry.nome));
        });
    });
}
function mandaProvincia(){
    let province = document.getElementById("drop");
    $.ajax({
        url: '/api/comuni/' + province.value,
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
