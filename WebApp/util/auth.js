const jwt=require("jsonwebtoken");
const util=require("./../util/config");
const mySQL=require("./../db/dbConnection");
let isAuthorizedAdmin  = function(req, res, next) {
    var token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({auth: false, message: 'No token provided.'});
    }
    jwt.verify(token, util.secret, function(err, decoded) {
        if (err) return next(err);
        if(decoded.tipoUtente==="admin")
            return next();
        else
            return res.status(401).send({auth:false,message:"Not valid authorization."})
    });
};
let isAuthorizedUser =function(req, res, next) {
    if(req.session.user_id!==undefined){
        mySQL.query(`select email from utenti where id=${req.session.user_id}`,function (err,result) {
            if(err){
                return res.redirect("/");
            }else{
                if(result.length>0){
                    return next();
                }else{
                    return res.redirect("/");
                }
            }
        });

    }else{
        return res.redirect("/");
    }
};
module.exports={isAuthorizedAdmin,isAuthorizedUser};
