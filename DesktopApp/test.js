Date.prototype.addMonth = function(month) {
    var date = new Date();
    date.setMonth(date.getMonth()+month)
    return date;
};
let data=new Date();
console.log(data.addMonth(12))
