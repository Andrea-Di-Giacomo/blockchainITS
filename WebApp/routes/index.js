var express = require('express');
var router = express.Router();
let auth=require("./../util/auth");
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user_id===undefined)
  res.render('main',{sessione:req.session.user_id});
  else
    res.render("mainPage.hbs",{sessione:req.session.user_id});
});
router.get("/mainPage",auth.isAuthorizedUser,function (req,res,next) {
  res.render("mainPage.hbs",{sessione:req.session.user_id});
});
router.get("/contacts",auth.isAuthorizedUser,function (req,res,next) {
  res.render("contact.hbs",{sessione:req.session.user_id});
});
module.exports = router;
