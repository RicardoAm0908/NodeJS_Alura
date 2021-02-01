const database = require('../models')

class NivelController {
    static async BuscarNiveis(req, res) {
      try {
        const retorno = await database.Niveis.findAll()
        return res.status(200).json(retorno)
      } catch (error) {
        return res.status(500).json(error.message);
      }
    }

    static async BuscarPorId(req, res){
        try{
            const retorno = await database.Niveis.findOne({
                where: {
                    id: Number(req.params.idNivel)
                }
            })
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async SalvarNivel(req, res){
        try{    
            const dados = req.body
            const retorno = await database.Niveis.create(dados)
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async Atualizar(req, res){
        try{
            await database.Niveis.update(req.body, {
                where:{
                    id: Number(req.params.idNivel)
                }
            })
            const retorno = await database.Niveis.findOne({
                where: {
                    id: Number(req.params.idNivel)
                }
            })
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async Excluir(req, res){
        try{
            await database.Niveis.destroy({
                where:{
                    id: Number(req.params.idNivel)
                }
            })            
            return res.status(200).json({ mensagem:`Nivel ${req.params.idNivel} removida com sucesso` })
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }
}

module.exports = NivelController