const database = require('../models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const { PessoasServices } = require('../services')
const servicoPesssoa = new PessoasServices()

class PessoaController {
    static async BuscarPessoasAtivas(req, res){
        try{
            const retorno = await servicoPesssoa.BuscarTodosAtivos()
            return res.status(200).json(retorno)
        } catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarPessoas(req, res){
        try{
            const retorno = await servicoPesssoa.BuscarTodos()
            return res.status(200).json(retorno)
        } catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarPorId(req, res){
        try{
            const retorno = await servicoPesssoa.BuscarPorId(Number(req.params.idPessoa))
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async SalvarPessoa(req, res){
        try{    
            const dados = req.body
            const retorno = await servicoPesssoa.Inserir(req.body)
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async Atualizar(req, res){
        try{
            database.sequelize.transaction(async transacao => {
                await servicoPesssoa.Atualizar(req.body, Number(req.params.idPessoa), {transaction : transacao})
                const retorno = await servicoPesssoa.BuscarPorId(Number(req.params.idPessoa))
                return res.status(200).json(retorno)
            })
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async Excluir(req, res){
        try{
            await servicoPesssoa.Excluir(Number(req.params.idPessoa))
            return res.status(200).json({ mensagem:`Pessoa ${req.params.idPessoa} removida com sucesso` })
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async RestauraPessoa(req, res){
        try{
            await database.Pessoas.restore({
                where:{
                    id: Number(req.params.idPessoa)
                }
            })            
        return res.status(200).json({ mensagem:`Pessoa ${req.params.idPessoa} restaurada com sucesso` })
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarMatriculasPessoa(req, res){
        try{
            const pessoa = await database.Pessoas.findOne({
                where: {
                    id: Number(req.params.idPessoa)
                }
            })
            const matriculas = await pessoa.getAulasMatriculadas()
            return res.status(200).json(matriculas)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarMatriculas(req, res){
        try{
            const retorno = await database.Matriculas.findAll({
                where: {
                    estudante_id: Number(req.params.idPessoa)
                }
            })
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarMatriculaPorId(req, res){
        try{
            const retorno = await database.Matriculas.findOne({
                where: {
                    estudante_id: Number(req.params.idPessoa),
                    id: Number(req.params.idMatricula)
                }
            })
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async SalvarMatricula(req, res){
        try{    
            const dados = {...req.body, estudante_id: Number(req.params.idPessoa)}
            const retorno = await database.Matriculas.create(dados)
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async AtualizarMatricula(req, res){
        try{
            await database.Matriculas.update(req.body, {
                where:{
                    estudante_id: Number(req.params.idPessoa),
                    id: Number(req.params.idMatricula)                    
                }
            })
            const retorno = await database.Matriculas.findOne({
                where: {
                    estudante_id: Number(req.params.idPessoa),
                    id: Number(req.params.idMatricula)      
                }
            })
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async ExcluirMatricula(req, res){
        try{
            await database.Matriculas.destroy({
                where:{
                    estudante_id: Number(req.params.idPessoa),
                    id: Number(req.params.idMatricula)
                }
            })            
            return res.status(200).json({ mensagem:`Matricula ${req.params.idMatricula} da Pessoa ${req.params.idPessoa} removida com sucesso` })
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarMatriculasPorTurma(req, res){
        try{
            const retorno = await database.Matriculas.findAndCountAll({
                where: {
                    turma_id: Number(req.params.idTurma),
                    status: "confirmado"
                },
                limit: 20,
                order: [['estudante_id', 'ASC']]
            })
            return res.status(200).json(retorno)
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async BuscarTurmasLotadas(req, res){
        try{
            const retorno = await database.Matriculas.findAndCountAll({
                where: {
                    status: "confirmado"
                },
                attributes: ['turma_id'],
                group: ['turma_id'],
                having: Sequelize.literal(`count(turma_id) >= ${qtdTurma}`)
            })
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }

    static async CancelaPessoa(req, res){
        try{           
            const retorno = servicoPesssoa.CancelaPessoa(req.params.idPessoa)
            return res.status(200).json({message: `Matrículas do estudante ${req.params.idPessoa} canceladas`})
        }catch(ex){
            return res.status(500).json(ex.message)
        }
    }
}

module.exports = PessoaController