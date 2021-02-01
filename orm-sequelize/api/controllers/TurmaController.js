const database = require('../models')
const sequelize = require('sequelize')
const Op = sequelize.Op

class TurmaController {
    static async BuscarTurmas(req, res) {
        try {
            const {data_inicial, data_final } = req.query
            const where = {}
            data_inicial || data_final ? where.data_inicio = {} : null         
            data_inicial ? where.data_inicio[Op.gte] = data_inicial : null            
            data_final ? where.data_inicio[Op.lte] = data_final : null

            const retorno = await database.Turmas.findAll({ where })
            return res.status(200).json(retorno)
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async BuscarPorId(req, res){
      try{
          const retorno = await database.Turmas.findOne({
              where: {
                  id: Number(req.params.idTurma)
              }
          })
          return res.status(200).json(retorno)
      }catch(ex){
          return res.status(500).json(ex.message)
      }
  }

  static async SalvarTurma(req, res){
      try{    
          const dados = req.body
          const retorno = await database.Turmas.create(dados)
          return res.status(200).json(retorno)
      }catch(ex){
          return res.status(500).json(ex.message)
      }
  }

  static async Atualizar(req, res){
      try{
          await database.Turmas.update(req.body, {
              where:{
                  id: Number(req.params.idTurma)
              }
          })
          const retorno = await database.Turmas.findOne({
              where: {
                  id: Number(req.params.idTurma)
              }
          })
          return res.status(200).json(retorno)
      }catch(ex){
          return res.status(500).json(ex.message)
      }
  }

  static async Excluir(req, res){
      try{
          await database.Turmas.destroy({
              where:{
                  id: Number(req.params.idTurma)
              }
          })            
          return res.status(200).json({ mensagem:`Turma ${req.params.idTurma} removida com sucesso` })
      }catch(ex){
          return res.status(500).json(ex.message)
      }
  }
}

module.exports = TurmaController