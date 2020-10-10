var express = require('express');
var router = express.Router();
var mySQL=require('./../db/dbConnection');
const jwt=require('jsonwebtoken');
const config=require('./../util/config');
let auth=require('./../util/auth');
let mail=require('./../util/mail');
let validatore=require('./../util/validator');
router.get('/province',function(req,res,next){
    mySQL.query("select nome from province", function (err, result) {
        res.set("Connection", "close");
        if (err){
            res.status(500);
            res.send("Servizio non disponibile.");
        }
        res.status(200);
        res.send(JSON.stringify(result));
    });
});
router.get('/comuni/:provincia', async function(req,res,next){
    res.set("Connection", "close");
    let v=validatore.validaProvincia(req.params);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else {
        let provincia = req.params.provincia;
        mySQL.query(`select comune from comuni where provincia = '${provincia}'`, function (err, result) {
            if (err) {
                res.status(500);
                res.send("Servizio non disponibile");
            }
            res.status(200);
            res.send((JSON.stringify(result)));
        });
    }
});
router.get('/address',auth.isAuthorizedAdmin,function(req,res,next){
    res.set("Connection", "close");
    mySQL.query(`select * from addresses a ,utenti u ,società s where a.id_società=s.id and s.id_titolare=u.id`, function (err, result) {
        if (err){
            res.status(500);
            res.send("Servizio non disponibile");
        }
        res.status(200);
        res.send((JSON.stringify(result)));
    });
});
router.patch('/address',auth.isAuthorizedAdmin,async function (req,res,next) {
    res.set("Connection", "close");
    let v=validatore.validaAddress(req.body);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else {
        let address = req.body.address;
        let id = req.body.id;
        mySQL.query(`select email from utenti where id='${id}';
    delete from addresses where address='${address}';
    update utenti set isEnabled=1 where id='${id}'`, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send("Servizio non disponibile");
            } else {
                res.status(204).send();
                /*mail.mailOptions.to = "andreadigiacomo6@gmail.com"; //andrebbe result[0].email per inserire la mail dell'utente ma per tesing uso la mia
                mail.mailOptions.subject="Richiesta accettata";
                mail.mailOptions.text = "La tua richiesta è stata accettata!\n Adesso ti sarà possibile collegarti alla Blockchain!";
                mail.transporter.sendMail(mail.mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.status(204).send();

                    }
                });*/
            }
        });
    }
});
router.delete('/user',async function (req,res,next) {
    res.set("Connection", "close");
    let id=req.body.id;
    let v=validatore.validaId(req.body);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else {
        mySQL.query(`select email from utenti where id='${id}';delete from utenti where id='${id}'`, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send("Servizio non disponibile");
            } else {
                res.status(204).send();
                /* mail.mailOptions.to = result[0].email;
                 mail.mailOptions.subject="Richiesta di partecipazione respinta";
                 mail.mailOptions.text = "Ci dispiace informarti che la tua richiesta non è stata approvata per prendere parte alla rete.";
                 mail.transporter.sendMail(mail.mailOptions, function (error, info) {
                     if (error) {
                         console.log(error);
                     } else {
                         console.log('Email sent: ' + info.response);

                     }
                 });*/
            }
        });
    }
});
router.post('/signup', async function(req, res, next) {
    res.set("Connection", "close");
    let nome=req.body.nome;
    let cognome=req.body.cognome;
    let email=req.body.email;
    let password=req.body.psw;
    let documentoTitolare=req.body.documento_titolare;
    let societa=req.body.nome_societa;
    let documento_societa=req.body.documento_societa;
    let tipoSocieta=req.body.tipoSocieta;
    let provincia=req.body.provincia;
    let comune=req.body.comune;
    let address=req.body.address;
    let v=validatore.validaSignup(req.body);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else{
        mySQL.query(`insert into utenti (nome,cognome,email,password,tipoUtente,documento_titolare) values ('${nome}','${cognome}','${email}',SHA2('${password}',256),'${tipoSocieta}','${documentoTitolare}')`, function (err, result) {
            if (err) {
                console.log(err);
                if(err.code==="ER_DUP_ENTRY"){
                    res.status(400);
                    res.send("Email già in uso")
                }else {
                    console.log(err)
                    res.status(500);
                    res.send("Servizio non disponibile");
                }
            }
            let id_titolare = result.insertId;
            mySQL.query(`insert into società (id_titolare,nome_società,documento_società,provincia,comune) values
             ('${id_titolare}','${societa}','${documento_societa}','${provincia}','${comune}')`, function (err, result) {
                if (err){
                    console.log(err);
                    if(err.code==="ER_DUP_ENTRY"){
                        console.log("Log: ripetuto");
                        mySQL.query('delete from utenti where id='+id_titolare);
                        res.status(400);
                        res.send("Società già presente.");
                    }else {
                        mySQL.query('delete from utenti where id='+id_titolare);
                        res.status(500);
                        res.send("Non è stato possibile inserire la società. Riprova più tardi");
                        res.end();
                    }
                }else{
                    let id_societa=result.insertId;
                    mySQL.query(`insert into addresses (id_società,address) values
                                ('${id_societa}','${address}')`, function (err, result) {
                        if (err){
                            console.log(err);
                            res.status(500);
                            res.send();
                        }else{
                            res.status(204).send();
                            //mySQL.query("select email from utenti where tipoUtente='admin'",function (err,resultAdmin) {
                                //for(let i=0;i<resultAdmin.length;i++){
                                    /*mail.mailOptions.to = "andreadigiacomo6@gmail.com";
                                    mail.mailOptions.subject="Nuova richiesta di partecipazione";
                                    mail.mailOptions.text = "E' presente una nuova richiesta di partecipazione alla rete. Apri la piattaforma admin per accettarla o rifiutarla!";
                                    mail.transporter.sendMail(mail.mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log('Email sent: ' + info.response);

                                        }
                                    });
                               // }
*/
                           // })

                        }
                    });
                }
            });
        });
    }

});
router.post('/login',async function (req,res,next) {
    res.set("Connection", "close");
    let v=validatore.validaLogin(req.body);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else {
        mySQL.query(`select id,tipoUtente from utenti where email='${req.body.email}' and isEnabled=1 and password=SHA2('${req.body.password}',256)`, function (err, result) {
            if (err) {
                res.status(400);
                res.keepAlive = false;
                res.send("L'email inserita non è valida o non è stato ancora confermato l'account")
            } else {
                var token = jwt.sign({
                        id: result[0].id,
                        tipoUtente: result[0].tipoUtente
                    }
                    , config.secret, {
                        expiresIn: 86400 // 24h
                    });
                res.status(200).send({token})
            }
        });
    }
});
router.get("/car/marca",function (req,res,next) {
    res.set("Connection", "close");
    mySQL.query("select name from marca", function (err, result) {
        if (err){
            res.status(500);
            res.send("Servizio non disponibile.");
        }
        res.status(200);
        res.send(JSON.stringify(result));
    });
});
router.get("/car/models/:marca",async function (req,res,next) {
    res.set("Connection", "close");
    let v=validatore.validaModelli(req.params);
    if(!await v.check()){
        res.status(422).send({error:v.errors});
    }else {
        let marca = req.params.marca;
        mySQL.query(`select DISTINCT m.name from modelli m,anno_produzione a,marca ma where ma.name="${marca}"
     and ma.id=a.make_id and a.id=m.makeyear_id ORDER BY m.name ASC`, function (err, result) {
            if (err) {
                res.status(500).send(JSON.stringify({message: "Dati non disponbili"}))
            } else {
                if (result.length === 0) {
                    res.status(200).send({Error: "Non sono stati trovati modelli sulla base della marca inserita"});
                } else {
                    res.status(200).send(JSON.stringify(result))
                }
            }
        })
    }
});
module.exports = router;
