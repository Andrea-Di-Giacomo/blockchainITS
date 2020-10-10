function loadCars() {
    $.ajax({
        url: '/users/vehicles/mine',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (result, resp, xhr) {

            if (xhr.status === 204) {

            } else {

                ///appendi la 2a parte
                let veicoliRegistrati=JSON.parse(xhr.responseText)[0];
                let annunci=JSON.parse(xhr.responseText)[1];
                loadUrCar(veicoliRegistrati,false);
                loadUrCar(annunci,true);
            }

        },
        error: function (xhr, resp, text) {
            let response = xhr.responseText;
            alert(response);
        }
    });


}

function loadUrCar(veicoliRegistrati,isAnnuncio){
    let sezioneRegistrati=document.getElementById("elencoVeicoli"); //appendi la prima parte a questa per ogni veicolo con ajax
    let sezioneAnnunci=document.getElementById("elencoAnnunci");
    for(let auto in veicoliRegistrati) {
        let containerRegistrati = document.createElement("div");
        containerRegistrati.className = "container";
        let rowTargaRegistrati = document.createElement("div");
        rowTargaRegistrati.className = "row";
        let colTargaRegistrati = document.createElement("div");
        colTargaRegistrati.className = "col-md-12";
        let h1TargaRegistrati = document.createElement("h1");
        h1TargaRegistrati.className = "text-center";
        h1TargaRegistrati.innerHTML =veicoliRegistrati[auto].targa.toUpperCase();
        colTargaRegistrati.appendChild(h1TargaRegistrati);
        rowTargaRegistrati.appendChild(colTargaRegistrati);
        containerRegistrati.appendChild(rowTargaRegistrati)
        let rowMarcaRegistrati = document.createElement("div");
        rowMarcaRegistrati.className = "row";
        let h3MarcaRegistrati = document.createElement("h3");
        h3MarcaRegistrati.innerHTML="Marca: "+veicoliRegistrati[auto].marca;
        rowMarcaRegistrati.appendChild(h3MarcaRegistrati);
        containerRegistrati.appendChild(rowMarcaRegistrati);

        let rowModelloRegistrati = document.createElement("div");
        rowModelloRegistrati.className = "row";
        let h3ModelloRegistrati = document.createElement("h3");
        h3ModelloRegistrati.innerHTML="Modello: "+veicoliRegistrati[auto].modello;
        rowModelloRegistrati.appendChild(h3ModelloRegistrati);
        containerRegistrati.appendChild(rowModelloRegistrati);

        let rowAnnoRegistrati = document.createElement("div");
        rowAnnoRegistrati.className = "row";
        let h3AnnoRegistrati = document.createElement("h3");
        h3AnnoRegistrati.innerHTML="Anno di immatricolazione: "+veicoliRegistrati[auto].anno;
        rowAnnoRegistrati.appendChild(h3AnnoRegistrati);
        containerRegistrati.appendChild(rowAnnoRegistrati);
        if(isAnnuncio===true){
            let rowUrl = document.createElement("div");
            rowUrl.className = "row";
            let linkUrlRegistrati = document.createElement("a");
            linkUrlRegistrati.innerHTML="<h3>Link all'annuncio</h3>";
            linkUrlRegistrati.href="http://localhost:3000/annunci/"+veicoliRegistrati[auto].targa;
            rowUrl.appendChild(linkUrlRegistrati);
            containerRegistrati.appendChild(rowUrl);
        }
        let divBottoneRegistrati=document.createElement("div");
        divBottoneRegistrati.className="row";
        let bottoneRegistrati=document.createElement("button");
        bottoneRegistrati.className="btn btn-danger";
        bottoneRegistrati.innerHTML="Elimina auto";
        if(isAnnuncio===true){
            bottoneRegistrati.value="annuncio";
        }else{
            bottoneRegistrati.value="myCar";
        }
        bottoneRegistrati.onclick=deleteCar;
        bottoneRegistrati.id=veicoliRegistrati[auto].targa;
        divBottoneRegistrati.appendChild(bottoneRegistrati);
        containerRegistrati.appendChild(divBottoneRegistrati);
        if(isAnnuncio===true){
            sezioneAnnunci.appendChild(containerRegistrati)
        }else{
            sezioneRegistrati.appendChild(containerRegistrati)
        }
    }
}
function deleteCar() {
    console.log(this.id);
    console.log(this.value);
    $.ajax({
        url: '/users/vehicles/'+this.id+"/"+this.value,
        type: 'DELETE',
        dataType: 'json',
        contentType: "application/json;charset=UTF-8",
        success: function (result, resp, xhr) {

                alert("Veicolo rimosso correttamente");
                location.reload();

        },
        error: function (xhr, resp, text) {
            alert("Non è stato possibile rimuovere il veicolo.");
        }
    });
}
