const conexao = require('../infraestrutura/database/conexao')
const uploadArquivo = require('../arquivos/uploadDeArquivos')

class Pet {
    adiciona(pet, res) {
        const sql = "INSERT INTO tb_pets (nome, imagem) VALUES ($1, $2)"
        uploadArquivo(pet.imagem, `${pet.nome}`, (erro, path) => {
            if(erro){
                res.status(400).json({erro})
                return
            }
            pet.imagem = path
            conexao.query(sql, Object.values(pet), erro => {     
                if(erro){
                    res.status(400).json(erro)
                }else{
                    res.status(201).json(pet)
                }
            })            
        })
    }
}

module.exports = new Pet()