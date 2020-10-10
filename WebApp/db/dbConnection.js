var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database:"tesi_app_web",
    multipleStatements:true
});


module.exports=con;
