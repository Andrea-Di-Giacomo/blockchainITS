multichainNodeAsync=require("./src/multichain-node").multichainNodeAsync;
function checkUser() {
    multichainNodeAsync.listAddresses().then(res=>{
        let address=res[0].address;
        console.log(address)
        multichainNodeAsync.listStreamKeyItems({stream:"consorzio",key:address.toUpperCase()}).then(res=> {
           if(res[0].data.json.tipoUtente==="CONCESSIONARIO"){
               document.getElementById("immatricolazione").style.display="block";
               document.getElementById("riparazione").style.display="block";
               localStorage.setItem("user","CONCESSIONARIO");
           }else
            if(res[0].data.json.tipoUtente==="MECCANICO"){
                document.getElementById("riparazione").style.display="block";
                localStorage.setItem("user","MECCANICO");
            }else
           if(res[0].data.json.tipoUtente==="ASSICURAZIONE"){
               document.getElementById("assicurazione").style.display="block";
               document.getElementById("incidente").style.display="block";
               localStorage.setItem("user","ASSICURAZIONE");
           }
        }).catch(err=>{
            if(err.code=="-703"){
                multichainNodeAsync.subscribe({stream:"consorzio"}).then(res=>{
                    multichainNodeAsync.subscribe({stream:"riparazioni"}).then(res=>{
                        checkUser();
                    })

                })
            }
           console.log(err)
        });
    }).catch(err=>{
        console.log("Servizio non disponibile");
    })
}
