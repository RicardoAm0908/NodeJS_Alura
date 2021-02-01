const psql = require('pg')

const conexao = new psql.Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'agenda-petshop',
    password: 'postgres',
    port: 5432
})

module.exports = conexao