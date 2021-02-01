const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const config = require('config')
const NaoEncontrado = require('./erros/NaoEncontrado')
const CampoInvalido = require('./erros/CampoInvalido')
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos')
const FormatoInvalido = require('./erros/FormatoInvalido')
const FormatosAceitos = require('./Serializador').formatosAceitos
const SerializadorErro = require('./Serializador').SerializadorErro



app.use(bodyParser.json())

app.use((requisicao, resposta, proximo) => {
    let formatoRequisitado = requisicao.header('Accept')
    if(formatoRequisitado === "*/*"){
        formatoRequisitado = "application/json"
    }
    
    
    if(FormatosAceitos.indexOf(formatoRequisitado) === -1){
        resposta.status(406)
        resposta.end()
        return
    }
    
    resposta.setHeader('Content-Type', formatoRequisitado)
    proximo()
})

app.use((requisicao, resposta, proximo) => {
    resposta.set('Access-Control-Allow-Origin', '*')
    proximo()
})

const roteador = require('./rotas/fornecedores')
const { use } = require('./rotas/fornecedores')
app.use('/api/fornecedores', roteador)

const roteadorV2 = require('./rotas/fornecedores/rotas.v2')
app.use('/api/v2/fornecedores', roteadorV2)

app.use((ex, requisicao, resposta, proximo) => {
    let status = 500
    if(ex instanceof NaoEncontrado){
        status = 404;
    }else if(ex instanceof CampoInvalido || ex instanceof DadosNaoFornecidos){
        status = 400;
    }else if(ex instanceof FormatoInvalido){
        status = 406;
    }

    const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
    )
    resposta.status(status)
    resposta.send(serializador.serializar({
        mensagem: ex.message,
        id: ex.idErro
    }))
})


app.listen(config.get('api.porta'), () => console.log("App rodando"))
