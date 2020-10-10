let faker=require('faker');
let tipi_alimentazione=["DIESEL,BENZINA,GPL,ELETTRICO,METANO"];
let alimentazione = tipi_alimentazione[Math.floor(Math.random() * tipi_alimentazione.length)];
console.log("INDICE:"+Math.floor(Math.random() * tipi_alimentazione.length))
console.log(alimentazione)
console.log(faker.name.firstName());
console.log("O'con".replace("'"," "));
console.log(faker.internet.email);
