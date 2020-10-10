var express = require('express');
var router = express.Router();
let auth=require("./../util/auth");
let mySQL=require("./../db/dbConnection");
let multichainNodeAsync=require("./../multichain/multichain-connect").multichainNodeAsync;
let validatore=require("./../util/validator");
router.get('/',auth.isAuthorizedUser,function(req, res, next) {
    res.render('annunci',{sessione:req.session.user_id});
});

router.get("/filter/",auth.isAuthorizedUser,function (req,res,next) {
    let query=createQueryFilter(req.query);
    mySQL.query(query,function (err,result) {
        if(err){
            console.log(err);
            res.status(500).send({message:"Servizio non disponibile"});
        }else{
            if(result.length===0){
                res.status(204).send();
            }else{
                console.log(result);
                res.status(200).send(result);
            }
        }
    })
});

router.get("/:targa",auth.isAuthorizedUser,function (req,res,next) {
    res.render('annuncioVeicolo',{sessione:req.session.user_id,targa:req.params.targa});
});

router.get("/veicolo/:targa",auth.isAuthorizedUser,async function (req,res,next) {
    let riparazioni=[];
    let v=validatore.validaTarga(req.params);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else {
        mySQL.query(`select id,email,marca,modello,cilindrata,prezzo,chilometraggio,cavalli,alimentazione,provincia,comune,telefono,
    DATE_FORMAT(anno_immatricolazione,GET_FORMAT(DATE,'EUR')) as anno,prezzo,cambio,descrizione from annunci,utenti where annunci.targa='${req.params.targa}' and utenti.id=annunci.id_proprietario;
    select immagine from img_annunci where targa_veicolo='${req.params.targa}'`, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send("Servizio non disponibile");
            } else {
                if (result[0].length > 0) {
                    multichainNodeAsync.listStreamKeyItemsAsync({
                        stream: "riparazioni",
                        key: req.params.targa.toUpperCase()
                    }).then(resMultiChain => {
                        let proprietari = [];
                        for (let i = 0; i < resMultiChain.length; i++)
                            proprietari.push(resMultiChain[i].data.json.proprietario);
                        let proprietariUnici = Array.from(new Set(proprietari));
                        console.log(proprietariUnici.length);
                        result[0][0].numProp = proprietariUnici.length;
                        if (result[0][0].id === req.session.user_id) {
                            result[0][0].owner = true;
                            res.status(200).send(result)
                        } else {
                            result[0][0].owner = false;
                            res.status(200).send(result);
                        }

                    }).catch(err => {
                        console.log(err);
                        res.status(500).send("Servizio non disponibile");
                    })

                } else {
                    res.status(204).send();
                }
            }
        });
    }
});
router.patch("/veicolo/:targa",auth.isAuthorizedUser,async function (req,res,next) {

    let v=validatore.validaInfoMezzo();
    if(!await v.check){
        res.status(422).send(v.errors);
    }else {
        if (req.params.targa === "" || req.body.prezzo === "" || req.body.descrizione === "" || req.body.prezzo === "") {
            res.status(400).send();
        } else {
            mySQL.query(`update annunci set prezzo='${req.body.prezzo}',descrizione='${req.body.descrizione}',telefono='${req.body.telefono}'
        where id_proprietario=${req.session.user_id} and targa='${req.params.targa}'`, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    res.status(204).send()
                }
            })
        }
    }
});


function createQueryFilter(data){
    let myQuery=`SELECT an.targa,an.marca,an.modello,an.cavalli,an.alimentazione,DATE_FORMAT(an.anno_immatricolazione,GET_FORMAT(DATE,'EUR'))
     as anno_immatricolazione, an.provincia, an.prezzo,an.chilometraggio,an.cambio,img.immagine FROM annunci an,img_annunci img 
     where img.id = ( SELECT img1.id FROM img_annunci img1 WHERE an.targa=img1.targa_veicolo ORDER BY img1.id LIMIT 1 ) `;
    if(data.marca!=="")
        myQuery+=`and an.marca="${data.marca}" `;
    if(data.modello!=="")
        myQuery+=`and an.modello="${data.modello}" `;
    if(data.potenzaMin!=="")
        myQuery+=`and an.cavalli>="${data.potenzaMin}" `;
    if(data.potenzaMax!=="")
        myQuery+=`and an.cavalli<="${data.potenzaMax}" `;
    if(data.alimentazione!=="")
        myQuery+=`and an.alimentazione="${data.alimentazione}" `;
    if(data.provincia!=="")
        myQuery+=`and an.provincia="${data.provincia}" `;
    if(data.comune!=="")
        myQuery+=`and an.comune="${data.comune}" `;
    if(data.annoMin!=="")
        myQuery+=`and an.anno_immatricolazione>="${data.annoMin}" `;
    if(data.annoMax!=="")
        myQuery+=`and an.anno_immatricolazione<="${data.annoMax}" `;
    if(data.prezzoMin!=="")
        myQuery+=`and an.prezzo>="${data.prezzoMin}" `;
    if(data.prezzoMax!=="")
        myQuery+=`and an.prezzo<="${data.prezzoMax}" `;
    if(data.kmMin!=="")
        myQuery+=`and an.chilometraggio>="${data.kmMin}" `;
    if(data.kmMax!=="")
        myQuery+=`and an.chilometraggio<="${data.kmMax}" `;
    if(data.cambio!=="")
        myQuery+=`and an.cambio="${data.cambio}" `;
    myQuery+=`limit ${data.inizio},${parseInt(data.inizio)+5} `;
    return myQuery;
}
module.exports = router;
