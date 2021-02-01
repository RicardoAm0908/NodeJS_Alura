const query = require('../infraestrutura/database/queries')

class Atendimento {
    adiciona (atendimento) {
        const sql = "INSERT INTO tb_atendimentos (cliente, pet, servico, data, status, observacoes, datacriacao) VALUES ($1, $2, $3, $4, $5, $6, $7)"
        return query(sql, atendimento)
    }

    lista() {
        const sql = `SELECT * FROM tb_atendimentos`
        return query(sql)
    }

    buscarPorId(id) {
        const sql = `SELECT * FROM tb_atendimentos WHERE id = ${id}`
        return query(sql)       
    }

}

module.exports = new Atendimento