var express = require('express');
var router = express.Router();
let auth=require('./../util/auth');
let multichainNodeAsync=require("./../multichain/multichain-connect").multichainNodeAsync;
let validatore=require("./../util/validator");
router.get('/:input',auth.isAuthorizedUser,async function(req,res,next){
    let v=validatore.validaIntervento(req.params);
    if(!await v.check()){
        res.status(422).send("Parametro di input non conforme");
    }else {
        let input = req.params.input;
         await multichainNodeAsync.listStreamKeyItemsAsync({
            stream: "riparazioni",
            key: input.toUpperCase(),
            count: 100000
        }).then(async result => {
            if(result.length>0) {
                let riparazioni = result;
                for (let concessionario in riparazioni) {
                    let publisher = riparazioni[concessionario].publishers[0];
                    await multichainNodeAsync.listStreamKeyItemsAsync({
                        stream: "consorzio",
                        key: publisher.toUpperCase()
                    }).then(async risultato => {
                        result[concessionario].data.json.societa = risultato[0].data.json.societa;
                        result[concessionario].data.json.locazione = risultato[0].data.json.locazione;
                        result[concessionario].data.json.tipoUtente = risultato[0].data.json.tipoUtente;

                    });
                }
            }
                await multichainNodeAsync.listStreamKeyItems({
                    stream: "assicurazioni",
                    key: input.toUpperCase(),
                    count: 10000
                }).then(async result2 => {
                        try {
                            if (result2.length === 0) {
                            result[0].data.json.scadenza_ass = "Dato non disponibile";
                            result[0].data.json.polizze = "Dato non disponibile";
                            } else {
                                if(result.length===0){
                                    result.push({
                                            data:
                                                {
                                                    json: {
                                                        scadenza_ass: "",
                                                        polizze: [],
                                                        marca:"",
                                                        modello:""
                                                    }
                                                }
                                        }
                                    );
                                }
                                let assicurazione = result2[result2.length - 1];

                                result[0].data.json.scadenza_ass = assicurazione.data.json.durata_polizza;
                                result[0].data.json.polizze = assicurazione.data.json.polizza;
                                result[0].data.json.marca = assicurazione.data.json.marca;
                                result[0].data.json.modello = assicurazione.data.json.modello;

                            }
                            res.status(200).send(result);
                        }catch (e) {
                            res.status(204).send();
                            res.end();
                        }

                });


        }).catch(err => {
            console.log(err);
            res.status(500).send();
        })
    }
});
module.exports = router;
