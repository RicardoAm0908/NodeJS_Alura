require('dotenv').config()
const { InvalidArgumentError, NaoEncontrado, NaoAutorizado } = require('./src/erros')
const { JsonWebTokenError, TokenExpiredError } = require('jsonwebtoken')

const app = require('./app')
const port = 3000
require('./database')
require('./redis/blocklist-access-token')
require('./redis/allowlist-refresh-token')

app.use((req, res, next) => {
    res.set({
        'Content-Type': 'application/json'
    })

    next()
})

const routes = require('./rotas')
routes(app)

app.use((erro, req, res, next) => {
    let status = 500
    const corpo = {
        mensagem: erro.message
    }

    console.log(erro)

    if (erro instanceof InvalidArgumentError) {
        status = 400        
    } else if (erro instanceof JsonWebTokenError){
        status = 401
    }else if(erro instanceof TokenExpiredError){
        status = 401
        corpo.expiradoEm = err.expiredAt
    }else if(erro instanceof NaoEncontrado){
        status = 404
    }else if(erro instanceof NaoAutorizado){
        status = 401
    }

    res.status(status).json(corpo)

})

app.listen(port, () => console.log('A API está funcionando!'))
