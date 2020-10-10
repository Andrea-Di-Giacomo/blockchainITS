function getFormattedDate() {
    let tmpDate=new Date();
    var dd = String(tmpDate.getDate()).padStart(2, '0');
    var mm = String(tmpDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tmpDate.getFullYear();

    tmpDate = dd + '/' + mm + '/' + yyyy;
    return (tmpDate);
}
module.exports={getFormattedDate};
