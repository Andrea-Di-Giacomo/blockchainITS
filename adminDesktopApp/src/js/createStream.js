multichainNodeAsync=require("./../js/api-multichain").multichainNodeAsync;
function send(){
    let nomeStream=document.getElementById("nomeStream");
    if(nomeStream.value===""){
        document.getElementById("msg").innerHTML = "Inserisci un nome per la stream";
        document.getElementById("msg").style.display='block';
    }else {
        document.getElementById("msg").style.display='none';
        multichainNodeAsync.createAsync({type: "stream", name: nomeStream.value, open: false}).then(res => {
            multichainNodeAsync.subscribeAsync({stream:nomeStream.value}).then(res=>{
                alert("La stream " + nomeStream.value + " è stata creata con successo!");
            }).catch(err=>{
                alert("Servizio non disponibile")
            })

        }).catch(err => {
            if(err.code=="-705") {
                document.getElementById("msg").innerHTML = "Esiste già una stream con il nome inserito";
                document.getElementById("msg").style.display = 'block';
            }
            else {
                document.getElementById("msg").innerHTML = "Verifica la connettivita con il peer della Blockchain";
                document.getElementById("msg").style.display='block';
            }
        })
    }
}
