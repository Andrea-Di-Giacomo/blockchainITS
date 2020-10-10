multichainNodeAsync=require("./multichain-connect").multichainNodeAsync
let mySQL=require("./../db/dbConnection");



//console.log(curr_date.getDay()+"/"+parseInt((curr_date.getMonth())+1).toString()+"/"+curr_date.getFullYear());
console.log(getFormattedDate())
multichainNodeAsync.listStreamQueryItems({
    stream: "riparazioni",
    query: {keys: ["Tagliando","06/09/2018"]},
    count: 100000}).then(res => {
    if(res.length>0){
        for(let elemento in res){
            console.log(res[elemento].keys[0]);
            mySQL.query(`select email from utenti,veicoli where id=id_proprietario and targa='${res[elemento].keys[0]}'`,function (err,result) {
                if(err){
                    console.log(err)
                }else{
                    if(result.length>0){
                       console.log(res)
                    }
                }
            });
        }

    }
}).catch(err => {
    console.log(err)
});
function getFormattedDate() {
    let tmpDate=new Date();
    var dd = String(tmpDate.getDate()).padStart(2, '0');
    var mm = String(tmpDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tmpDate.getFullYear();

    tmpDate = dd + '/' + mm + '/' + yyyy;
    return (tmpDate);
}
