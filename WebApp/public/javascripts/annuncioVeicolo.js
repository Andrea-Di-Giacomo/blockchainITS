let targaInUso;
function loadAnnuncio(targa) {
    targaInUso=targa;
    $.ajax({
        url: '/annunci/veicolo/' + targa,
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (result, resp, xhr) {
            if(xhr.status===204){
                document.getElementsByClassName("jumbotron")[0].style.display="block";
                document.getElementById("info").style.display="none";
            }else{
                document.getElementsByClassName("jumbotron")[0].style.display="none";
                document.getElementById("info").style.display="block";
                let dati_veicolo=JSON.parse(xhr.responseText)[0][0];
                console.log(dati_veicolo);

                let img_veicolo=JSON.parse(xhr.responseText)[1];
                createSlideshow(img_veicolo);
                fillFields(dati_veicolo,targa);
            }
        //<div class="swiper-slide" style="background-image:
            // url(https://placeholdit.imgix.net/~text?txtsize=68&amp;txt=Slideshow+Image&amp;w=1920&amp;h=500);"></div>
        },
        error: function (xhr, resp, text) {
            if(xhr.status===422){
                alert("Il formato della targa inserito non è valido");
                location.reload()
            }
            alert("Servizio non disponibile");
        }
    })
}
function createSlideshow(img_veicolo) {
    let slider_container=document.getElementsByClassName("swiper-wrapper")[0];

    let indicatore_num_slide=document.getElementsByClassName("carousel-indicators")[0];
    let num_slide=document.createElement("li");
    num_slide.setAttribute("data-target","#carouselExampleIndicators");
    num_slide.setAttribute("data-slide-to","0");
    num_slide.className="active";
    indicatore_num_slide.appendChild(num_slide);
    let carousel_container=document.getElementsByClassName("carousel-inner")[0];
    let carousel_item=document.createElement("div");
    carousel_item.className="carousel-item active";
    let slide=document.createElement("img");
    slide.src=img_veicolo[0].immagine;
    slide.className="d-block w-100";
    carousel_item.appendChild(slide);
    carousel_container.appendChild(carousel_item);
    for(let i=1;i<img_veicolo.length;i++){
        let num_slide2=document.createElement("li");
        num_slide2.setAttribute("data-target","#carouselExampleIndicators");
        num_slide2.setAttribute("data-slide-to",i.toString());
        indicatore_num_slide.appendChild(num_slide2)

    }
    for(let i=1;i<img_veicolo.length;i++){
        let carousel_item2=document.createElement("div");
        carousel_item2.className="carousel-item";
        let slide2=document.createElement("img");
        slide2.src=img_veicolo[i].immagine;
        slide2.className="d-block w-100";
        carousel_item2.appendChild(slide2);
        carousel_container.appendChild(carousel_item2);

    }
}

function fillFields(dati_veicolo,targa) {
    document.getElementById("veicoloTitolo").innerHTML=dati_veicolo.marca+" "+dati_veicolo.modello;
    document.getElementById("alimentazione").innerHTML=dati_veicolo.alimentazione;
    document.getElementById("potenza").innerHTML=dati_veicolo.cavalli;
    document.getElementById("anno").innerHTML=dati_veicolo.anno;
    document.getElementById("cambio").innerHTML=dati_veicolo.cambio;
    document.getElementById("chilometraggio").innerHTML=dati_veicolo.chilometraggio;
    document.getElementById("cilindrata").innerHTML=dati_veicolo.cilindrata;
    document.getElementById("comune").innerHTML=dati_veicolo.comune;
    document.getElementById("descrizione").innerHTML=dati_veicolo.descrizione;
    document.getElementById("provincia").innerHTML=dati_veicolo.provincia;
    document.getElementById("email").innerHTML=dati_veicolo.email;
    document.getElementById("telefono").innerHTML=dati_veicolo.telefono;
    document.getElementById("numProp").innerHTML=dati_veicolo.numProp;
    document.getElementById("riparazioniLink").href="/car/search?Targa="+targa;
    document.getElementById("prezzo").innerHTML=dati_veicolo.prezzo;
    if(dati_veicolo.owner===true){
        let updateButton=document.createElement("button");
        updateButton.className="btn btn-secondary";
        updateButton.id="updateBtn";
        updateButton.innerHTML="Aggiorna l'annuncio";
        updateButton.style.marginTop="5%";
        updateButton.onclick=update;
        document.getElementById("intermezzo").appendChild(updateButton)
    }
}

function update() {
    let updateBtn=document.getElementById("updateBtn");
    let telefono=document.getElementById("telefono");
    let descrizione=document.getElementById("descrizione");
    let prezzo=document.getElementById("prezzo");
    updateBtn.innerHTML="Conferma modifiche";
    updateBtn.onclick=aggiorna;
    updateBtn.className="btn btn-success";
    let telefonoInput=document.createElement("input");
    telefonoInput.type="text";
    telefonoInput.value=telefono.innerHTML;
    telefonoInput.id="telefonoInput";
    telefono.parentNode.replaceChild(telefonoInput,telefono);
    let descrizioneInput=document.createElement("textArea");
    descrizioneInput.value=descrizione.innerHTML;
    descrizioneInput.cols="100";
    descrizioneInput.rows="10";
    descrizioneInput.id="descrizioneInput";
    descrizione.parentNode.replaceChild(descrizioneInput,descrizione);
    let prezzoInput=document.createElement("input");
    prezzoInput.type="text";
    prezzoInput.value=prezzo.innerHTML;
    prezzoInput.id="prezzoInput";
    prezzo.parentNode.replaceChild(prezzoInput,prezzo);
}


function aggiorna() {
    data=JSON.stringify({
        telefono:document.getElementById("telefonoInput").value,
        descrizione:document.getElementById("descrizioneInput").value,
        prezzo:document.getElementById("prezzoInput").value
        });
    console.log(JSON.stringify(data))
    $.ajax({
        url: '/annunci/veicolo/' + targaInUso,
        type: 'PATCH',
        dataType: 'json',
        data:data,
        contentType: "application/json;charset=UTF-8",
        success: function (result, resp, xhr) {
                alert("Annuncio aggiornato!");
                location.reload();
            },
        error: function (xhr, resp, text) {
            if(xhr.status===400)
                alert("Hai lasciato qualche campo vuoto, riempili tutti per poter aggiornare l'annuncio");
            else {
                alert("Servizio non disponibile");
                location.reload();
            }
        }
    })
}
