$('#addCarForm').on('submit',function (ev){
    ev.preventDefault();
    let strOutput=$("#marca").val()+" "+$("#modello").val()+" targata "+$("#targa").val();
    $.ajax({
        url: '/car',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            targa: $("#targa").val(),
            telaio: $("#telaio").val(),
            marca: $("#marca").val(),
            modello: $("#modello").val(),
            anno:$("#anno_prod").val()
        }),
        contentType: "application/json;charset=UTF-8",
        success: function (response) {
            showJumbo(strOutput)
        },
        error: function (xhr, resp) {
            console.log(xhr);
            console.log(resp);
            if (xhr.status === 400) {
                alert("Il veicolo è gia presente nel sistema.");
            }
            if (xhr.status === 500) {
                alert("Servizio momentaneamente non disponibile")
            }
        }
    });


});
function showJumbo(msg) {
    document.getElementsByClassName("jumbotron")[0].style.display="block";
    document.getElementById("infoSpan").innerHTML=msg;
    document.getElementsByClassName("container")[0].style.display="none";
}
function loadMarche(){
    let anno=document.getElementById("anno_prod");
    for (let i=1980;i<2020;i++){
        anno.options[anno.options.length]=new Option(i.toString(),i.toString())
    }
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
