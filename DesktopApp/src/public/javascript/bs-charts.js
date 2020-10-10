let $=require('jquery');
var multichainNodeAsync=require("./../multichain-node").multichainNodeAsync;
$(document).ready(function(){
	loadSelectAnno();
	showView(localStorage.getItem("user"))
});
var barChart;
function loadData(intervento,anno,id_chart) {
	clearChart("tagliandi");
	clearChart("revisioni");
	clearChart("immatricolazioni");
	clearChart("rip_straordinaria");
	clearChart("assicurazioni");
	clearChart("incidenti");
	multichainNodeAsync.getAddressesAsync().then(res => {
		console.log(res[0]);
		if(localStorage.getItem("user")==="ASSICURAZIONE") {
			multichainNodeAsync.listStreamQueryItems({
				stream: "assicurazioni",
				query: {publisher: res[0]},
				count: 100000
			}).then(result => {
				console.log(result);
				let annoTmp;
				let resFiltrati = [];
				for (let i = 0; i < result.length; i++) {
					if (result[i].keys[3] === undefined)
						break;
					annoTmp = result[i].keys[3].split("/");
					annoTmp = annoTmp[2];
					if (annoTmp === anno) {
						resFiltrati.push(result[i])
					}
				}
				createCanvas(id_chart, resFiltrati)
			}).catch(err => {
				console.log(err)
			});
			multichainNodeAsync.listStreamQueryItems({
				stream: "incidenti",
				query: {publisher: res[0]},
				count: 100000
			}).then(result => {
				console.log(result);
				let annoTmp;
				let resFiltrati = [];
				for (let i = 0; i < result.length; i++) {
					if (result[i].keys[3] === undefined)
						break;
					annoTmp = result[i].keys[3].split("/");
					annoTmp = annoTmp[2];
					if (annoTmp === anno) {
						resFiltrati.push(result[i])
					}
				}
				createCanvas(id_chart, resFiltrati)
			}).catch(err => {
				console.log(err)
			})
		}else {
			multichainNodeAsync.listStreamQueryItems({
				stream: "riparazioni",
				query: {keys: [intervento.toUpperCase()], publisher: res[0]},
				count: 100000
			}).then(result => {
				console.log(result);
				let annoTmp;
				let resFiltrati = [];
				for (let i = 0; i < result.length; i++) {
					if (result[i].keys[3] === undefined)
						break;
					annoTmp = result[i].keys[3].split("/");
					annoTmp = annoTmp[2];
					if (annoTmp === anno) {
						resFiltrati.push(result[i])
					}
				}
				createCanvas(id_chart, resFiltrati)
			}).catch(err => {
				console.log(err)
			})
		}
	}).catch(err => {
		console.log(err)
	});
}
function createCanvas(id,dati) {
	let numImmatricolazioni=[0,0,0,0,0,0,0,0,0,0,0,0]; //array contenente i numeri di immatricolazioni
	for(let i=0;i<dati.length;i++){
		let mese=dati[i].keys[3].split("/");
		mese=mese[1];
		switch (mese) {
			case "01": numImmatricolazioni[0]+=1;
			break;
			case "02": numImmatricolazioni[1]+=1;
				break;
			case "03": numImmatricolazioni[2]+=1;
				break;
			case "04": numImmatricolazioni[3]+=1;
				break;
			case "05": numImmatricolazioni[4]+=1;
				break;
			case "06": numImmatricolazioni[5]+=1;
				break;
			case "07": numImmatricolazioni[6]+=1;
				break;
			case "08": numImmatricolazioni[7]+=1;
				break;
			case "09": numImmatricolazioni[8]+=1;
				break;
			case "10": numImmatricolazioni[9]+=1;
				break;
			case "11": numImmatricolazioni[10]+=1;
				break;
			case "12": numImmatricolazioni[11]+=1;
				break;
		}
	}

	var popCanvas = document.getElementById(id);
	barChart = new Chart(popCanvas, {
		type: 'bar',
		data: {
			labels: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre","Novembre","Dicembre"],
			datasets: [{
				label: id.toUpperCase(),
				data: [numImmatricolazioni[0], numImmatricolazioni[1], numImmatricolazioni[2], numImmatricolazioni[3], numImmatricolazioni[4],
					numImmatricolazioni[5], numImmatricolazioni[6], numImmatricolazioni[7], numImmatricolazioni[8], numImmatricolazioni[9],
					numImmatricolazioni[10],numImmatricolazioni[11]],
				backgroundColor: 'rgba(54, 162, 235, 0.6)'
			}],
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		}
	});
}
function loadSelectAnno() {
	let annoImm=document.getElementById("annoImm");
	annoImm.options[annoImm.options.length]=new Option("Anno","");
	annoImm.options[annoImm.options.length-1].selected=true;
	annoImm.options[annoImm.options.length-1].disabled=true;
	for (let i=2000;i<new Date().getFullYear()+1;i++){
		annoImm.options[annoImm.options.length]=new Option(i.toString(),i.toString())
	}
}
$("#annoImm").on("change",function () {
	let anno=$("#annoImm").val();
	let user=localStorage.getItem("user");
	switch (user) {
		case "CONCESSIONARIO":
			document.getElementById("divImm").style.display="block";
			document.getElementById("divRip").style.display="block";
			document.getElementById("divRev").style.display="block";
			document.getElementById("divTag").style.display="block";
			loadData("IMMATRICOLAZIONE",anno,"immatricolazioni");
			loadData("Tagliando",anno,"tagliandi");
			loadData("Revisione",anno,"revisioni");
			loadData("Riparazione straordinaria",anno,"rip_straordinaria");
			break;
		case "MECCANICO":
			document.getElementById("divRip").style.display="block";
			document.getElementById("divRev").style.display="block";
			document.getElementById("divTag").style.display="block";
			loadData("Tagliando",anno,"tagliandi");
			loadData("Revisione",anno,"revisioni");
			loadData("Riparazione straordinaria",anno,"rip_straordinaria");
			break;
		case "ASSICURAZIONE":
			document.getElementById("divAss").style.display="block";
			document.getElementById("divInc").style.display="block";
			loadData("",anno,"assicurazioni");
			loadData("",anno,"incidenti");
	}

});

function clearChart(id) {
    var parent = document.getElementById(id+"Container");
    var child = document.getElementById(id);
    parent.removeChild(child);
    parent.innerHTML ='<canvas id='+id+'  style="max-height:600px; max-width:600px"></canvas>';

}
function showView(user) {
	switch (user) {
		case "CONCESSIONARIO":
			document.getElementById("divAss").style.display = "none";
			document.getElementById("divInc").style.display = "none";
			break;
		case "MECCANICO":
			document.getElementById("divAss").style.display="none";
			document.getElementById("divInc").style.display="none";
			document.getElementById("divImm").style.display="none";
			break;
		case "ASSICURAZIONE":
			document.getElementById("divImm").style.display="none";
			document.getElementById("divRip").style.display="none";
			document.getElementById("divRev").style.display="none";
			document.getElementById("divTag").style.display="none";
			break;
	}
}
