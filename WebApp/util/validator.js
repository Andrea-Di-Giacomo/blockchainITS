const {Validator}=require('node-input-validator');
let Validatore= {
    validaAddress: function (params) {
        return new Validator(params,
            {
                address: "required|maxLength:40",
                id: "required|integer"
            }
        )
    },
    validaProvincia: function (params) {
        return new Validator(params,
            {
                provincia: "required|maxLength:30",
            }
        )
    },
    validaId:function (params) {
        return new Validator(params,
            {
                id:"required|integer|maxLength:10"
            }
        )
    },
    validaSignup:function (params) {
        return new Validator(params,
            {
                nome:"required|string|maxLength:20",
                cognome:"required|string|maxLength:30",
                email:"required|email",
                psw:"required|string",
                documento_titolare:"required|string|contains:base64,",
                nome_societa:"required|string",
                documento_societa:"required|string|contains:base64,",
                tipoSocieta:"required|string|maxLength:20",
                provincia:"required|string|maxLength:30",
                comune:"required|string|maxLength:30",
                address:"required|string|maxLength:40"
            }
        )
    },
    validaLogin:function (params) {
        return new Validator(params,
            {
                email:"required|email",
                password: "required|string"
            })
    },
    validaModelli:function (params) {
        return new Validator(params,
            {
                marca:"required|string|maxLength:30"
            })
    },
    validaTarga:function (params) {
        return new Validator(params,
            {
                targa:"required|string|maxLength:7"
            })
    },
    validaInfoMezzo:function (params) {
        return new Validator(params,
        {
            targa: "required|string|maxLength:7",
            prezzo:"required|string|integer",
            telefono:"required|string|",
            descrizione:"required|string"
        })
    },
    validaInfoMyCar:function (params) {
        return new Validator(params,{
            targa: "required|string|maxLength:7",
            telaio:"required|string|maxLength:17",
            marca:"required|string|maxLength:30",
            modello:"required|string|maxLength:30",
            anno:"required|string|maxLength:10"
        })
    },
    validaAnnuncio:function (params) {
        return new Validator(params,{
            targa: "required|string|maxLength:7",
            marca:"required|string|maxLength:30",
            modello:"required|string|maxLength:30",
            cilindrata:"required|integer|maxLength:4",
            cavalli:"required|integer|maxLength:4",
            anno:"required|string|maxLength:10",
            alimentazione:"required|string|maxLength:20",
            provincia:"required|string|maxLength:30",
            comune:"required|string|maxLength:30",
            telefono:"required|string|",
            prezzo:"required|integer",
            chilometraggio:"required|integer",
            cambio:"required|string",
            descrizione:"required|string"
        })
    },
    validaIntervento:function (params) {
        return new Validator(params,{
            input:"required|string"
        })
    },
    validaSignupPrivato:function (params) {
        return new Validator(params,
            {
                nome:"required|string|maxLength:20",
                cognome:"required|string|maxLength:30",
                email:"required|email",
                psw:"required|string",
            }
        )
    },
    validaPassword:function (params) {
        return new Validator(params,
            {
                password_vecchia:"required|string",
                password:"required|string"
            })
    },
    validaEliminazioneVeicolo:function (params) {
        return new Validator(params,
            {
                targa: "required|string|maxLength:7",
                tipo:"required|string"
            })
    }
};
module.exports=Validatore;
