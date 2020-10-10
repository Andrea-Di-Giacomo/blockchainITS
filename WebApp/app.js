var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter=require("./routes/api");
var carRouter=require("./routes/car");
var interventiRouter=require("./routes/interventi");
var annunciRouter=require("./routes/annunci");
const session=require('express-session');
const hbs=require('express-handlebars');
const cron=require("node-cron");
const mySQL=require("./db/dbConnection");
let multichainNodeAsync=require("./multichain/multichain-connect").multichainNodeAsync;
let mail=require("./util/mail");
const formatted_date=require("./util/formattedDate");

var app = express();
process.on('uncaughtException', function (err) {
  console.error(err);
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'hbs');
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  partialsDir: __dirname + '/views/partials/'
}));
app.use(session({secret: 'session-secret-development',saveUninitialized: false,resave: true}));
app.use(logger('dev'));
app.use(express.json({limit:'50mb',extended: true}));
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api',apiRouter);
app.use("/car",carRouter);
app.use("/interventi",interventiRouter);
app.use("/annunci",annunciRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if(req.headers['content-type']==="application/json"){
    res.status(404).send({error:"Not found"});
  }else{
    next(createError(404));
  }

});


cron.schedule(" 59 23 * * * *", function() {
  multichainNodeAsync.listStreamQueryItems({
    stream: "riparazioni",
    query: {keys: ["Tagliando",formatted_date.getFormattedDate()]},
    count: 100000}).then(res => {
    if(res.length>0){
      for(let elemento in res){
        mySQL.query(`select email,targa,marca,modello,anno from utenti,veicoli where id=id_proprietario and targa='${res[elemento].keys[0]}'`,function (err,result) {
          if(err){
            console.log(err)
          }else{
            if(result.length>0){
              mail.mailOptions.to=result[0].email;
              mail.mailOptions.text="La tua "+result[0].marca+" "+result[0].modello+" del "+result[0].anno+" targata "+result[0].targa+" dovrebbe andare a fare il tagliando al più presto. Ad oggi è passato un anno dall'ultimo!";
              mail.transporter.sendMail(mail.mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }
          }
        });
      }

    }
  }).catch(err => {
    console.log(err)
  });
});
module.exports = app;
