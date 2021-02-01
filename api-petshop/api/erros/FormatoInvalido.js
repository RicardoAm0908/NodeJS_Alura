class FormatoInvalido extends Error{
    constructor (contentType) {
       const mensagem = `Formato '${contentType}' não suportado`
       super(mensagem)
       this.name = 'FormatoInvalido'
       this.idErro = 3
    }
}

module.exports = FormatoInvalido