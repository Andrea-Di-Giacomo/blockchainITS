var express = require('express');
var router = express.Router();
var mySQL=require('./../db/dbConnection');
let auth=require('./../util/auth');
let multichainNodeAsync=require("./../multichain/multichain-connect").multichainNodeAsync;
let validatore=require("./../util/validator");
router.get("/search",auth.isAuthorizedUser,function (req,res,next) {
    res.render("searchCar.hbs",{sessione:req.session.user_id})
});

router.get('/myCars',auth.isAuthorizedUser,function (req,res,next) {
   res.render("myCars",{sessione:req.session.user_id})
});
router.get('/',auth.isAuthorizedUser,function (req,res,next) {
   res.render("addCar",{sessione:req.session.user_id});
});
router.post("/",auth.isAuthorizedUser,async function (req,res,next) {
    let targa=req.body.targa;
    let telaio=req.body.telaio;
    let marca=req.body.marca;
    let modello=req.body.modello;
    let anno=req.body.anno;
    let user_id=req.session.user_id;
    let v=validatore.validaInfoMyCar(req.body);
    if(!await v.check()){
        res.status(422).send(v.errors)
    }else{
    mySQL.query(`insert into veicoli(targa,telaio,id_proprietario,marca,modello,anno) VALUES  
    ('${targa}','${telaio}','${user_id}','${marca}','${modello}','${anno}')`,function (err,result) {
       if(err){
           if (err.code === "ER_DUP_ENTRY") {
               res.status(400);
               res.send({data:"Targa già in uso"});
           }else{
               res.status(500);
               res.send({data:"Servizio non disponibile"});
           }
       }else{
           res.status(204).send();
       }
    });
    }
});
router.get("/annuncio",auth.isAuthorizedUser,function (req,res,next) {
   res.render("creaAnnuncio",{sessione:req.session.user_id});
});
router.get("/:targa",auth.isAuthorizedUser,async function (req,res,next) {
    let v=validatore.validaTarga(req.params);
    if(!await v.check()){
        res.status(422).send(v.errors)
    }else {
        multichainNodeAsync.listStreamKeyItems({
            stream: "riparazioni",
            key: req.params.targa.toUpperCase()
        }).then(result => {
            if (result.length !== 0) {
                if (result[0].keys[2] === "IMMATRICOLAZIONE") {
                    res.status(200).send({immatricolazione: result[0], ultimo: result[result.length - 1]})
                } else {
                    res.status(204).send();
                }
            } else {
                res.status(204).send();
            }
        })
    }
});
router.post("/annuncio",auth.isAuthorizedUser,async function (req,res,next) {

    let v=validatore.validaAnnuncio(req.body);
    if(!await v.check()){
        res.status(422).send(v.errors)
    }else {
        multichainNodeAsync.listStreamKeyItems({
            stream: "riparazioni",
            key: req.body.targa
        }).then(async resultMultichain => {
            if (resultMultichain.length < 0) {
                res.status(400).send("Il veicolo non risulta essere certificato.")
            } else {
                await mySQL.query(`insert into annunci(targa,marca,modello,cilindrata,cavalli,alimentazione,provincia,comune,telefono,
    anno_immatricolazione,prezzo,chilometraggio,cambio,descrizione,id_proprietario) VALUES  
    ('${req.body.targa}','${req.body.marca}','${req.body.modello}','${req.body.cilindrata}','${req.body.cavalli}','${req.body.alimentazione}',
    "${req.body.provincia}","${req.body.comune}","${req.body.telefono}",STR_TO_DATE("${req.body.anno}","%m/%d/%Y"),"${req.body.prezzo}","${req.body.chilometraggio}",
    "${req.body.cambio}","${req.body.descrizione}","${req.session.user_id}")`, async function (err, result) {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            res.status(400);
                            res.send({data: "Veicolo già presente"});
                        } else {
                            res.status(500);
                            res.send({data: "Servizio non disponibile"});
                        }
                    } else {
                        for (let image in req.body.immagini) {
                            await mySQL.query(`insert into img_annunci(targa_veicolo,immagine) VALUES
                ('${req.body.targa}','${req.body.immagini[image]}')`, function (err, result) {
                                if (err) {
                                    res.status(500);
                                    res.send({data: "Non è stato possibile inserire le immagini."});
                                }
                            })
                        }
                        res.status(204).send();
                    }
                });
            }
        }).catch(err => {
            res.status(500);
            res.send({data: "Servizio non disponibile"});
        });
    }
});
router.get("/incidenti/:targa",auth.isAuthorizedUser,async function (req,res,next) {
    let v=validatore.validaTarga(req.params);
    if(!await v.check()){
        res.status(422).send(v.errors)
    }else {
        multichainNodeAsync.listStreamKeyItems({
            stream: "incidenti",
            key: req.params.targa.toUpperCase()
        }).then(async result => {
            if (result.length !== 0) {
                for (let i=0;i<result.length;i++){
                    await multichainNodeAsync.listStreamKeyItems({
                        stream:"consorzio",
                        key:result[i].publishers[0].toUpperCase()
                    }).then(consRes=>{
                        console.log(consRes);
                        result[i].data.json.assicurazione=consRes[0].data.json.societa;
                        result[i].data.json.locazione=consRes[0].data.json.locazione;
                    })
                }
                    res.status(200).send(result)
            } else {
                res.status(204).send();
            }
        })
    }
});
module.exports=router;
