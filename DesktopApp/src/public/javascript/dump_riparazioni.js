axios=require('axios');
multichainNodeAsync=require('./../../multichain-node').multichainNodeAsync;
let faker=require('faker');

function exec(x) {
    let veicoli = [];
    let riparazioni = ["TAGLIANDO", "REVISIONE", "RIPARAZIONE STRAORDINARIA"];
    let elencoRiparazioni = ["Sostituzione gomme anteriori", "Sostituzione gomme posteriori", "Sostituzione cambio",
        "Sostituzione frizione", "Sostituzione filtri", "Sostituzione fari", "Sostituzione radiatore", "Riparazioni carrozzeria"];
    let esitoRevisione = ["POSITIVO", "NEGATIVO"];
    let chilometraggio = 0;
    let dataCorrente;
    let riparazioniEseguite = [];
    multichainNodeAsync.listStreamKeyItemsAsync({stream: "riparazioni",key:"IMMATRICOLAZIONE", count: 1000}).then(res => {
        for (let i = 50; i < res.length; i++) {
            res[i].data.json.targa = res[i].keys[0];
            res[i].data.json.telaio = res[i].keys[1];
            veicoli.push(res[i].data.json);
        }
        console.log(veicoli.length);
        for (let i = 0; i < 50; i++) {
            let veicoloInRiparazione=veicoli[i];
            for(let k=0;k<4;k++){
                chilometraggio=chilometraggio+(Math.floor(Math.random()*10000)+7000);
                let tipoRiparazione=riparazioni[Math.floor(Math.random()*riparazioni.length)];
                if(tipoRiparazione==="Revisione"){
                    riparazioniEseguite.push("Controllo superato")
                }else{
                    let tmp=elencoRiparazioni.sort(()=>0.5-Math.random());
                    riparazioniEseguite=tmp.slice(0,4)
                }
                let data_riparazione=randomDate(new Date(2016, 0, 1), new Date());
            multichainNodeAsync.publishAsync({
                stream: 'riparazioni', //l'address lo si ottiene dal publisher dello stream item
                key: [veicoloInRiparazione.targa.toUpperCase(), veicoloInRiparazione.telaio.toUpperCase(), tipoRiparazione.toUpperCase(), data_riparazione],
                data: {
                    json: {proprietario:veicoloInRiparazione.proprietario.toUpperCase(),marca:veicoloInRiparazione.marca.toUpperCase(),
                       modello:veicoloInRiparazione.modello.toUpperCase(),tipoRiparazione:tipoRiparazione.toUpperCase(),riparazioni:riparazioniEseguite,chilometraggio:chilometraggio}
                }
            }).then(res => {
                chilometraggio=0;
                riparazioniEseguite=[];
                console.log(i + " gruppo di riparazioni inserite");
            }).catch(err => {
                console.log(err);
            });
            }
            chilometraggio=0;
            riparazioniEseguite=[];
        }})
        .catch(err=>{
        if(err.code=="-703") {
            multichainNodeAsync.subscribeAsync({stream: "riparazioni"}).then(res => {
                exec()
            }).catch(err => {
                console.log(err);
            })
        }else{
            console.log(err);
        }
    });

}
function letterGen () {
    var text = "";
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (var i = 0; i < 2; i++) {
        text += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return text;
}
function genTelaio(length) {
    let telai=[];
    let k=0;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    while(k<100) {
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        if(telai.includes(result)){
            continue;
        }else{
            telai.push(result);
            result='';
            k++;
        }
    }
    return telai;
}

function randomDate(start, end) {
     let tmpDate=new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    var dd = String(tmpDate.getDate()).padStart(2, '0');
    var mm = String(tmpDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tmpDate.getFullYear();

    tmpDate = dd + '/' + mm + '/' + yyyy;
    return (tmpDate);
}
exec();
