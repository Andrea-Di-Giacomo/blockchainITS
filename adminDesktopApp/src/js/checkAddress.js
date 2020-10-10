const output=require("./../util/util");
multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
function send() {
    let input=document.getElementById("search").value;
    multichainNodeAsync.validateAddressAsync({address:input}).then(res=>{
        if(res.isvalid===false){
            document.getElementById("msg").style.display='block';
        }else {
            let permessi=[];
            document.getElementById("msg").style.display='none';
            let output_finale=res;
            multichainNodeAsync.listPermissionsAsync({
                permissions: "all",
                addresses: input,
                verbose: true
            }).then(res => {
                for (let permesso in res) {
                    permessi.push(res[permesso].type);
                }
            output.removeElements(document.querySelectorAll("table"));
                output_finale.permessi=permessi;
            output.createTable(output_finale, true);
        })
        }
    }).catch(err=>{
        output.putRawOutput("Servizio momentaneamente non disponibile");
    });
}
