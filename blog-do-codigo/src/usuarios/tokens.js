const jwt = require ('jsonwebtoken');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const crypto = require('crypto');
const moment = require('moment');
const blocklistAccessToken = require('../../redis/blocklist-access-token');

const {InvalidArgumentError} = require('../erros');


function criaTokenJWT(idUsuario, [tempoQuantidade, tempoUnidade]){
    const payload = { id: idUsuario };
    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQuantidade + tempoQuantidade });
    return token;

}
async function verificaTokenNaBlocklist(token, nome, blocklist){
    const tokenblocklist = await blocklist.contemToken(token);
    if(tokenblocklist){
        throw new jwt.JsonWebTokenError(`${nome} inválido!`);
    }
}

async function verificaTokenJWT(token, nome, blocklist){
    await verificaTokenNaBlocklist(token, nome, blocklist);
    const { id } = jwt.verify(token, process.env.CHAVE_JWT);
    return id;
}

async function invalidaTokenJWT(token, blocklist){    
    await blocklist.adiciona(token);
}
  
async function criaTokenOpaco(idUsuario, [tempoQuantidade, tempoUnidade], allowlist){
    const payload = { id: idUsuario}
    const token = crypto.randomBytes(24).toString('hex');
    const dataExpiracao = moment().add(tempoQuantidade, tempoUnidade).unix();
    await allowlist.adiciona(token, idUsuario, dataExpiracao);
    return token;
}

async function verificaTokenOpaco(token, nome, allowlist){    
    verificaTokenEnviado(token, nome);
    const id = await allowlist.buscaValor(token);
    verificaTokenValido(id, nome);
    return id;
}


function verificaTokenValido(id, nome) {
    if (!id) {
        throw new InvalidArgumentError(`${nome} token inválido`);
    }
}

function verificaTokenEnviado(token, nome) {
    if (!token) {
        throw new InvalidArgumentError(`${nome} token não enviado!`);
    }
}

async function invalidaTokenOpaco(token, nome, blocklist){
    if(!token){
        throw new InvalidArgumentError(`${nome} token não enviado!`)
    }
    await blocklist.deleta(token);
}




module.exports = {
    access: {
        nome: 'Access Token',
        lista: blocklistAccessToken,
        expiracao: [ 15, 'm'],
        cria(idUsuario){
            return criaTokenJWT(idUsuario, this.expiracao);
        },
        verifica(token){
            return verificaTokenJWT(token, this.nome, this.lista);
        },
        invalida(token){
            return invalidaTokenJWT(token, this.lista);
        }
    },
    refresh: {
        nome: 'Refresh',
        expiracao: [5, 'd'],
        lista: allowlistRefreshToken,
        cria(idUsuario){
            return criaTokenOpaco(idUsuario, this.expiracao, this.lista);
        },
        verifica(token){
            return verificaTokenOpaco(token, this.nome, this.lista);
        },
        invalida(token){
            return invalidaTokenOpaco(token, this.nome, this.lista);
        }
    }
}

