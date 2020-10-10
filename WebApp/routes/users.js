var express = require('express');
var router = express.Router();
var mySQL=require('./../db/dbConnection');
const SHA=require("sha256");
const auth=require('./../util/auth');
const mail=require("./../util/mail");
const validatore=require("./../util/validator");
router.get('/signup', function(req, res, next) {
  res.render('signupPrivato');
});
router.get('/login', function(req, res, next) {
    res.render('login');
});
router.post("/login", async function (req,res,next) {
    let v=validatore.validaLogin(req.body);
    if(!await v.check()){
        res.status(422).send();
    }else {
        let password = SHA(req.body.password);
        mySQL.query(`select id,nome,cognome,password from utenti where email='${req.body.email}' and isEnabled=1 and password='${password}'`, function (err, result) {
            if (err) {
                console.log(err);
                res.render("errorPage")
            } else {
                if (result[0] === undefined) {
                    res.status(400).send();
                } else {
                    req.session.user_id = result[0].id;
                    req.session.email = req.body.email;
                    res.status(204).send();
                }
            }
        });
    }
});
router.post('/signup', async function(req, res, next) {
    let v=validatore.validaSignupPrivato(req.body);
    if(! await v.check()){
        res.status(422).send(v.errors)
    }else {
        let nome = req.body.nome;
        let cognome = req.body.cognome;
        let email = req.body.email;
        let token = SHA(nome + cognome + email + req.body.psw);
        let password = SHA(req.body.psw);
        let tipoUtente = "privato";
        mySQL.query(`insert into utenti (nome,cognome,email,password,tipoUtente) values('${nome}','${cognome}','${email}','${password}','${tipoUtente}')`, function (err, result) {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400);
                    res.send({data: "Email già in uso"});
                }
            } else {
                let id_utente = result.insertId;
                mySQL.query(`insert into registration_token (token,id_utente) values('${token}','${id_utente}')`, function (err, result) {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            res.status(400);
                            res.send({data: "Email già in uso"});
                        } else {
                            res.status(500).send("Servizio non disponibile")
                        }
                    } else {
                        /*mail.mailOptions.to = email;
                        mail.mailOptions.subject="Verifica l'email!";
                        mail.mailOptions.text = "Grazie per esserti registrato!\nPer poter accedere, clicca il seguente link per convalidare il tuo account!\n http://localhost:3000/users/validate?t="+token;
                        mail.transporter.sendMail(mail.mailOptions, function (error, info) {
                            if (error) {
                                console.log("AAAAAAAAAAAAAAAAA"+error);
                            } else {
                                console.log('Email sent: ' + info.response);

                            }
                        });*/
                        res.status(204).send();
                    }
                });
            }
        });
    }
});
router.get("/validate",function (req,res,next) {
   res.render("validatePage");
});
router.get('/profile',auth.isAuthorizedUser,function (req,res,next) {
   res.render("userProfile",{sessione:req.session.user_id})
});
router.patch("/password",auth.isAuthorizedUser,async function (req,res,next) {
    let v=validatore.validaPassword(req.body);
    if(!await v.check()){
        res.status(422).send(v.errors)
    }else {
        let psw_vecchia = req.body.password_vecchia;
        let new_psw = SHA(req.body.password);
        let id = req.session.user_id;
        mySQL.query(`UPDATE utenti set password='${new_psw}' where id='${id}'`, function (err, result) {
            if (err) {
                res.status(500).send();
            } else {
                res.status(204).send();
            }
        })
    }
});
router.delete("/",auth.isAuthorizedUser,function (req,res,next) {
    let id=req.session.user_id;
    req.session=undefined;
    mySQL.query(`DELETE FROM utenti where id=${id}`,function (err,result) {
        if(err){
            console.log(err);
            res.status(500).send({data:"Servizio non disponibile"});
        }else{
            res.status(204).send();
        }
    })
});
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});
router.get("/vehicles",auth.isAuthorizedUser,function (req,res,next) {
    res.render("tuoiVeicoli",{sessione:req.session.user_id})
});
router.get("/vehicles/mine",auth.isAuthorizedUser,function (req,res,next) {
    mySQL.query(`SELECT targa,marca,modello,anno from veicoli where id_proprietario='${req.session.user_id}';
    SELECT targa,marca,modello,YEAR(anno_immatricolazione) as anno from annunci where id_proprietario='${req.session.user_id}'`,function(err,result){
        if(err){
            console.log(err);
            res.status(500).send({message:"Servizio non disponibile"})
        }else {
            if (result.length > 0) {
                console.log(result);
                res.status(200).send(result)
            } else {
                res.status(204).send()
            }
        }
    });
});
router.delete("/vehicles/:targa/:tipo",auth.isAuthorizedUser,async function (req,res,next) {
    let v=validatore.validaEliminazioneVeicolo(req.params);
    if(!await v.check()){
        res.status(422).send(v.errors)
    }else {
        let id = req.session.user_id;
        let query = '';
        if (req.params.tipo === "myCar") {
            query = `DELETE FROM veicoli`
        } else {
            query = `DELETE FROM annunci`;
        }
        query += ` where id_proprietario=${id} and targa='${req.params.targa}'`;
        console.log(query);
        mySQL.query(query, function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send({data: "Servizio non disponibile"});
            } else {
                res.status(204).send();
            }
        })
    }
    });
router.patch("/confirmation",function (req,res,next) {
   mySQL.query(`update utenti set isEnabled=1 where 
   id=(select id_utente from registration_token where token='${req.query.t}')`,function (err,result) {
       if(err){
           console.log(err);
           res.status(500).send("Servizio non disponibile");
       }else{
           res.status(204).send();
       }
   })
});
module.exports = router;
