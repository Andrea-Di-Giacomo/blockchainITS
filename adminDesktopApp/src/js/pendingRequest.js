const axios=require('axios');
multichainNodeAsync=require('./../js/api-multichain').multichainNodeAsync;
let credenziali=require("./../util/mapping").credenzialiUtenteAdmin;
function show_info(){
    let container=document.getElementById("container");
    axios.post('http://localhost:3000/api/login',{
        email:credenziali.email,
        password:credenziali.password
    }).then(function (response) {
        localStorage.setItem("token",response.data.token);
        console.log(localStorage.getItem("token"));
        axios.get('http://localhost:3000/api/address',{
            headers:{
                    Authorization:localStorage.getItem("token")
            }
        })
            .then(function (response) {
                createPendingHTML(response)

            })
            .catch(function (error) {
                alert("Servizio delle API non disponibile. Riprova più tardi.");
                console.log(error);
            });
    }).catch(function (err) {
        alert("Servizio delle API non disponibile. Riprova più tardi.");
        console.log(err);
    });

}
function accetta(){
    let id_info=this.id;
    let info=document.getElementsByClassName(id_info);
    let societa=info[5].innerHTML;
    let locazione=info[7].innerHTML;
    let address=info[8].innerHTML;
    let id=info[9].innerHTML;
    let tipoUtente=info[4].innerHTML.toUpperCase();
    multichainNodeAsync.publishAsync({
        stream: 'consorzio',
        key: [address.toUpperCase(),societa.toUpperCase()],
        data: {json: {address: address, societa: societa,locazione:locazione, data: dataCorrente(),tipoUtente:tipoUtente}}
    }).then(res => {
        axios.patch("http://localhost:3000/api/address",{
            address: address,
            id:id
        },{
            headers:{
                Authorization:localStorage.getItem("token")
            }
        })
            .then(function (response) {
                multichainNodeAsync.grantAsync({addresses: address, permissions:"connect,send,receive,mine"}).then(
                    res=> {
                        if (tipoUtente !== "ASSICURAZIONE") {
                            multichainNodeAsync.grantAsync({
                                addresses: address,
                                permissions: "riparazioni.write"
                            }).then(res => {
                                alert("Il nodo è stato aggiunto nella rete");
                                location.href = "pendingRequest.html";
                            }).catch(err => {
                                console.log(err)
                            });
                        }else{
                            multichainNodeAsync.grantAsync({
                                addresses: address,
                                permissions: "assicurazioni.write"
                            }).then(res => {
                                multichainNodeAsync.grantAsync({
                                    addresses: address,
                                    permissions: "incidenti.write"
                                }).then(res => {
                                    alert("Il nodo è stato aggiunto nella rete");
                                    location.href = "pendingRequest.html";
                                }).catch(err => {
                                    console.log(err)
                                });
                            }).catch(err => {
                                console.log(err)
                            });
                        }
                    }
                ).catch(err=>{
                    alert("Servizio non disponibile. Riprova più tardi.");
                    location.href="pendingRequest.html";
                });

            })
            .catch(function (error) {
                alert("Servizio delle API non disponibile. Riprova più tardi.");
                location.href="pendingRequest.html";
            });
    }).catch(err => {
        alert("Servizio non disponibile. Riprova più tardi.");
        location.href="pendingRequest.html";
    });
}

function decline(){
    let id_info=this.id;
    let info=document.getElementsByClassName(id_info);
    let id=info[9].innerHTML;
    console.log(info[9].innerHTML);
        axios.delete("http://localhost:3000/api/user",{
            headers:{
                Authorization:localStorage.getItem("token")
            },
            data: {
                id: id
            },
        })
            .then(function (response) {
                    alert("Richiesta respinta");
                    location.href="pendingRequest.html";

                }
                )
            .catch(err=>{
            alert("Servizio delle API non disponibile. Riprova più tardi.");
            location.href="pendingRequest.html";
            //ipcErrorPage
                })
}
function dataCorrente(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return (today);
}
function createPendingHTML(response){
    for(let i=0;i<response.data.length;i++){
        let div=document.createElement("div");
        div.className="elemento";
        let nomeLabel=document.createElement('span');
        nomeLabel.innerHTML="<b>Nome</b>";
        let nome=document.createElement("p");
        nome.className="info "+i;
        nome.innerHTML=response.data[i].nome;
        let cognomeLabel=document.createElement("span");
        cognomeLabel.innerHTML="<b>Cognome</b>";
        let cognome=document.createElement("p");
        cognome.className="info "+i;
        cognome.innerHTML=response.data[i].cognome;
        let emailLabel=document.createElement("span");
        emailLabel.innerHTML="<b>Email</b>";
        let email=document.createElement("p");
        email.className="info "+i;
        email.innerHTML=response.data[i].email;
        let documento_titolareLabel=document.createElement("span");
        documento_titolareLabel.innerHTML="<p><b>Documento di riconoscimento</b></p>";
        let documento_titolare=document.createElement("img");
        documento_titolare.src=response.data[i].documento_titolare;
        documento_titolare.className="info "+i;
        let tipoUtenteLabel=document.createElement("span");
        tipoUtenteLabel.innerHTML="<b>Tipo di società </b>";
        let tipoUtente=document.createElement("p");
        tipoUtente.className="info "+i;
        tipoUtente.innerHTML=response.data[i].tipoUtente;
        nome_societaLabel=document.createElement("span");
        nome_societaLabel.innerHTML="<b>Nome della società</b>";
        let nome_societa=document.createElement("p");
        nome_societa.className="info "+i;
        nome_societa.innerHTML=response.data[i].nome_società;
        let documento_societaLabel=document.createElement("span");
        documento_societaLabel.innerHTML="<p><b>Documento della società</b></p>";
        let documento_societa=document.createElement("img");
        documento_societa.src=response.data[i].documento_società;
        documento_societa.className="info "+i;
        let locazioneLabel=document.createElement("span");
        locazioneLabel.innerHTML="<b>Locazione</b>";
        let locazione=document.createElement("em");
        locazione.className="info "+i;
        locazione.innerHTML=response.data[i].provincia+", "+response.data[i].comune;
        let address=document.createElement("p");
        address.className="info "+i;
        address.innerHTML=response.data[i].address;
        address.style.display='none';
        let id_societa=document.createElement("p");
        id_societa.className="info "+i;
        id_societa.innerHTML=response.data[i].id_società;
        id_societa.style.display='none';
        let id_titolare=document.createElement("p");
        id_titolare.className="info "+i;
        id_titolare.innerHTML=response.data[i].id_titolare;
        id_titolare.style.display='none';
        let acceptbutton=document.createElement("button");
        acceptbutton.id=i;
        acceptbutton.onclick=accetta;
        acceptbutton.className="btn btn-secondary";
        acceptbutton.innerHTML="Accetta richiesta";
        let declinebutton=document.createElement("button");
        declinebutton.id=i;
        declinebutton.onclick=decline;
        declinebutton.className="btn btn-danger";
        declinebutton.innerHTML="Respingi richiesta";
        declinebutton.style.cssFloat="right";
        let hr=document.createElement("hr");
        hr.className="divisore";
        div.appendChild(nomeLabel);
        div.appendChild(document.createElement('br'));
        div.appendChild(nome);
        div.appendChild(cognomeLabel);
        div.appendChild(cognome);
        div.appendChild(emailLabel);
        div.appendChild(email);
        div.appendChild(documento_titolareLabel);
        div.appendChild(documento_titolare);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
        div.appendChild(tipoUtenteLabel);
        div.appendChild(tipoUtente);
        div.appendChild(nome_societaLabel);
        div.appendChild(nome_societa);
        div.appendChild(documento_societaLabel);
        div.appendChild(documento_societa);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
        div.appendChild(locazioneLabel);
        div.appendChild(locazione);
        div.appendChild(address);
        div.appendChild(id_titolare);
        div.appendChild(id_societa);
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createElement('br'));
        div.appendChild(acceptbutton);
        div.appendChild(declinebutton);
        div.appendChild(hr);

        container.appendChild(div);
    }
}
