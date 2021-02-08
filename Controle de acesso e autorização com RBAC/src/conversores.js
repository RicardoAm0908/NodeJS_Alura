class Conversor {
    json(dados){
        return JSON.stringify(dados);
    }

    converter (dados) {
        if (this.camposPublicos.indexOf('*') === -1){
            dados = this.filtrar(dados)
        }
        if(this.contentType === 'json'){
            return this.json(dados)
        }
    }

    filtrar (dados) {
        if(Array.isArray(dados)){
            return dados = dados.map((post) => this.filtrarObjeto(post))
        }else{
            dados = this.filtrarObjeto(dados)
        }

        return dados
    }

    filtrarObjeto(objeto){
        const novoObjeto = {}
        this.camposPublicos.forEach((campo) =>{
            if(Reflect.has(objeto, campo)){
                novoObjeto[campo] = objeto[campo]
            }
        })
        return novoObjeto
    }
}

class ConversorPost extends Conversor {
    constructor(contentType, camposExtras = []) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['titulo', 'conteudo'].concat(camposExtras)
    }

    
}

class ConversorUsuario extends Conversor {
    constructor(contentType, camposExtras = []) {
        super()
        this.contentType = contentType
        this.camposPublicos = ['nome'].concat(camposExtras)
    }
}

module.exports = { ConversorPost, ConversorUsuario }