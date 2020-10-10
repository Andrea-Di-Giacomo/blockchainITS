multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
const output=require("./../util/util");
function showPermissions() {
    const checkedBoxes = document.querySelectorAll('input[name=permessi]:checked');
    let permessi=getCheckedBoxes();
    console.log(permessi);
    output.removeElements(document.querySelectorAll("table"));
    multichainNodeAsync.listPermissions({permissions:permessi}).then(res => {
        let indirizzi = [];
        for (address in res) {
            indirizzi.push(res[address].address)
        }
        document.getElementById('innerTitle').style.display="block";
        if(checkedBoxes.length<2) {
            output.createTable(indirizzi,true);
        }
        else {
            //output.putRawOutput("", mode(indirizzi));
            output.createTable(mode(indirizzi),true);
        }
    }).catch(err => {
        output.putRawOutput("Servizio non disponibile", err);
    });
}
function mode(arr){
    let counts = arr.reduce((a, c) => {
        a[c] = (a[c] || 0) + 1;
        return a;
    }, {});
    let maxCount = Math.max(...Object.values(counts));
    let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
    return mostFrequent
}
function getCheckedBoxes() {
    const checkedBoxes = document.querySelectorAll('input[name=permessi]:checked');
    let args='';
    for(let i=0;i<checkedBoxes.length;i++){
        if(i===checkedBoxes.length-1){
            args+=checkedBoxes[i].id;
        }else{
            args+=checkedBoxes[i].id+",";
        }

    }
    return args;
}
