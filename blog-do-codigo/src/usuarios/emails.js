const nodemailer = require('nodemailer');

const configuracaoEmailTeste = (contaTeste) => ({
    host: 'smtp.ethereal.email',
    auth:  contaTeste,
});

const configuracaoEmailProducao = () => ({
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    secure: true
});

async function criaConfiguracaoEmail(){
    if(process.env.NODE_ENV === 'production'){
        console.log(configuracaoEmailProducao());
        return configuracaoEmailProducao();
    }else{
        const contaTeste = await nodemailer.createTestAccount();
        return configuracaoEmailTeste(contaTeste);
    }
}

class Email {
    async enviaEmail(){
        const configuracaoEmail = await criaConfiguracaoEmail();
        const transportador = nodemailer.createTransport(configuracaoEmail);
        const info = await transportador.sendMail(this);
        if(process.env.NODE_ENV !== 'production'){
            console.log('URL: ' + nodemailer.getTestMessageUrl(info));
        }
    }    
}

class EmailVerificacao extends Email {
    constructor(usuario, endereco){
        super();
        this.from = '"Blog do Código" <noreplay@blogdocodigo.com.br>';
        this.to = usuario.email;
        this.subject = 'Verificação de e-mail';
        this.text = `Olá! Verifique seu e-mail aqui: ${endereco}`;
        this.html = `<h1>Olá!</h1> Verifique seu e-mail aqui: <a href="${endereco}">${endereco}</a>`;
    }
}


module.exports = { EmailVerificacao };