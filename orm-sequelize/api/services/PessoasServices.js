const Services = require('./Services')
const database = require('../models')

class PessoasServices extends Services{
    constructor(){
        super('Pessoas')
        this.matriculas = new Services('Matriculas')
    }

    async BuscarTodosAtivos(where = {}){
        return database[this.modelo].findAll({where: {...where}})
    }

    async BuscarTodos(where = {}){
        return database[this.modelo].scope('todos').findAll({where: {...where}})
    }

    async CancelaPessoa(id){
        database.sequelize.transaction(async transacao => {
            await super.AtualizarRegistros({id: id}, {ativo: false}, {transaction : transacao})
            await this.matriculas.AtualizarRegistros({estudante_id: id}, {status: 'cancelado'}, {transaction : transacao})
        })
    }

}

module.exports = PessoasServices