let inizio=0;
function send_data(ev) {
    if(ev===undefined){

    }else {
        ev.preventDefault();
    }
    ricerca = {
        marca: $("#marca").val(),
        modello: $("#modello").val(),
        potenzaMin: $("#potenzaMin").val(),
        potenzaMax: $("#potenzaMax").val(),
        alimentazione: $("#alimentazione").val(),
        provincia: $("#drop").val(),
        comune: $("#dropComuni").val(),
        annoMin: $("#annoMin").val(),
        annoMax: $("#annoMax").val(),
        prezzoMin: $("#prezzoMin").val(),
        prezzoMax: $("#prezzoMax").val(),
        kmMin: $("#kmMin").val(),
        kmMax: $("#kmMax").val(),
        cambio: $("#cambio").val(),
        inizio: inizio
    };
    $.ajax({
        url: '/annunci/filter',
        type: 'GET',
        dataType: 'json',
        data: ricerca,
        contentType: "application/json;charset=UTF-8",
        success: function (result, resp, xhr) {
            if (xhr.status === 204 && inizio<=5) {
                document.getElementById("errore").style.display = "block";
            } else {
                document.getElementById("col-dx").style.display = "block";
                let dati = JSON.parse(xhr.responseText);
                let sezione = document.getElementById("col-dx");
                for (let i = 0; i < dati.length; i++) {
                    let link=document.createElement("a");
                    let div_annuncio = document.createElement("div");
                    div_annuncio.id = dati[i].targa;
                    div_annuncio.href="/annunci/"+div_annuncio.id;
                    let div_row = document.createElement("div");
                    div_row.className = "row";
                    let img_anteprima = document.createElement("img");
                    img_anteprima.id = "car_img";
                    img_anteprima.className = "col-md-6 col-xl-3";
                    img_anteprima.src = dati[i].immagine;
                    let div_1 = document.createElement("div");
                    div_1.className = "col-md-6 col-xl-9 offset-xl-0";
                    let div_row_2 = document.createElement("div");
                    div_row_2.className = "row";
                    let div_col_1 = document.createElement("div");
                    div_col_1.className = "col";
                    let marca_h3 = document.createElement("h3");
                    marca_h3.className = "text-center";
                    marca_h3.innerHTML = dati[i].marca + " " + dati[i].modello;
                    div_col_1.appendChild(marca_h3);
                    let div_col_2 = document.createElement("div");
                    div_col_2.className = "col";
                    let prezzo_h3 = document.createElement("h3");
                    prezzo_h3.className = "text-center";
                    prezzo_h3.innerHTML = dati[i].prezzo + " " + "€";
                    div_col_2.appendChild(prezzo_h3);
                    div_row_2.appendChild(div_col_1);
                    div_row_2.appendChild(div_col_2);
                    div_1.appendChild(div_row_2);

                    let div_row_3 = document.createElement("div");
                    div_row_3.className = "row";
                    let div_col_3 = document.createElement("div");
                    div_col_3.className = "col";
                    let inside_row = document.createElement("div");
                    inside_row.className = "row";
                    let inside_col = document.createElement("div");
                    inside_col.className = "col";
                    let km = document.createElement("p");
                    km.innerHTML = dati[i].chilometraggio + " km";
                    let inside_row_2 = document.createElement("div");
                    inside_row_2.className = "row";
                    let alimentazione = document.createElement("p");
                    alimentazione.innerHTML = dati[i].alimentazione;

                    inside_col.appendChild(km);
                    inside_row.appendChild(inside_col);
                    div_col_3.appendChild(inside_row);
                    div_col_3.appendChild(inside_row_2);
                    div_col_3.appendChild(alimentazione);
                    div_row_3.appendChild(div_col_3);

                    let div_col_4 = document.createElement("div");
                    div_col_4.className = "col";
                    let inside_row_3 = document.createElement("div");
                    inside_row_3.className = "row";
                    let inside_col_3 = document.createElement("div");
                    inside_col_3.className = "col";
                    let data_imm = document.createElement("p");
                    data_imm.innerHTML = dati[i].anno_immatricolazione;
                    let inside_row_4 = document.createElement("div");
                    inside_row_4.className = "row";
                    let provincia = document.createElement("p");
                    provincia.innerHTML = dati[i].provincia;
                    inside_col_3.appendChild(data_imm);
                    inside_row_3.appendChild(inside_col_3);
                    div_col_4.appendChild(inside_row_3);
                    div_col_4.appendChild(inside_row_4);
                    div_col_4.appendChild(provincia);
                    div_row_3.appendChild(div_col_4);


                    let div_col_5 = document.createElement("div");
                    div_col_5.className = "col";
                    let inside_row_5 = document.createElement("div");
                    inside_row_5.className = "row";
                    let inside_col_4 = document.createElement("div");
                    inside_col_4.className = "col";
                    let cavalli = document.createElement("p");
                    cavalli.innerHTML = dati[i].cavalli + " CV";
                    let inside_row_6 = document.createElement("div");
                    inside_row_6.className = "row";
                    let cambio = document.createElement("p");
                    cambio.innerHTML = dati[i].cambio;
                    inside_col_4.appendChild(cavalli);
                    inside_row_6.appendChild(inside_col_4);
                    div_col_5.appendChild(inside_row_5);
                    div_col_5.appendChild(inside_row_6);
                    div_col_5.appendChild(cambio);
                    div_row_3.appendChild(div_col_5);
                    div_1.appendChild(div_row_3);
                    div_row.appendChild(img_anteprima);
                    div_row.appendChild(div_1);
                    div_annuncio.appendChild(div_row);
                    link.appendChild(div_annuncio);
                    link.href="/annunci/"+div_annuncio.id;
                    link.id="veicoloDiv";
                    sezione.appendChild(link);
                }
            }
        },
        error: function (xhr, resp, text) {
            let response = xhr.responseText;
            alert(response);
        }
    });
}
$("#searchForm").on("submit",function (ev) {
    inizio=0;
    document.getElementById("errore").style.display="none";
    $('#col-dx').empty();
    send_data(ev);
});
$(window).scroll(function(ev) {
    if($(window).scrollTop() === $(document).height() - $(window).height()) {
        inizio+=5;
        send_data(ev);
    }
});

function loadMarche(){
    $.ajax({
        url: '/api/car/marca',
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
            let response = xhr.responseText;
            alert(response);
        }
    });
}
function loadModelsByMakers() {
    let marca = document.getElementById("marca");
    $.ajax({
        url: 'http://localhost:3000/api/car/models/' + marca.value,
        type : "GET",
        dataType : 'json',
        success : function(result,resp,xhr) {
            let modelli = JSON.parse(xhr.responseText);
            let dropdown = document.getElementById("modello");
            $('#modello').empty();
            dropdown.options[dropdown.options.length]=new Option("Tutti","");
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

function loadConfig(){
    loadMarche();
    fillDropdownProvincia();
    let anno=document.getElementById("annoMin");
    for (let i=1980;i<2020;i++){
        anno.options[anno.options.length]=new Option(i,i)
    }
    let prezzo=document.getElementById("prezzoMin");
    let k=0;
    while(k<105000){
        prezzo.options[prezzo.options.length]=new Option(k,k)
        k+=5000;
    }
    let km=document.getElementById("kmMin");
   k=0;
    while(k<315000){
        km.options[km.options.length]=new Option(k,k)
        k+=15000;
    }
}
$("#annoMin").on("change",function () {
    $("#annoMax").empty();
   let annoMax=document.getElementById("annoMax");
   let annoMin=document.getElementById("annoMin").value;
   annoMax.options[annoMax.options.length]=new Option("Al","");
   for(let i=annoMin;i<2020;i++){
       annoMax.options[annoMax.options.length]=new Option(i,i)
   }
});
$("#prezzoMin").on("change",function () {
    $("#prezzoMax").empty();
    let prezzoMax=document.getElementById("prezzoMax");
    let prezzoMin=parseInt(document.getElementById("prezzoMin").value);
    prezzoMax.options[prezzoMax.options.length]=new Option("A","");
    prezzoMin+=5000;
    while(prezzoMin<105000){
        prezzoMax.options[prezzoMax.options.length]=new Option(prezzoMin,prezzoMin);
        prezzoMin+=5000;
    }
});
$("#kmMin").on("change",function () {
    $("#kmMax").empty();
    let kmMax=document.getElementById("kmMax");
    let kmMin=parseInt(document.getElementById("kmMin").value);
    kmMax.options[kmMax.options.length]=new Option("A","");
    kmMin+=15000;
    while(kmMin<315000){
        kmMax.options[kmMax.options.length]=new Option(kmMin,kmMin);
        kmMin+=15000;
    }
});
