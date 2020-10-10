var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'TesiBlockchain@gmail.com',
        pass: 'tesiunime'
    }
});
var mailOptions = {
    from: 'TesiBlockchain@gmail.com',
    to: '',
    subject: 'Esegui il tagliando',
    text: 'Ad oggi è passato un anno dal tuo ultimo tagliando, vai a farlo al più presto!'
};

module.exports={transporter,mailOptions};
