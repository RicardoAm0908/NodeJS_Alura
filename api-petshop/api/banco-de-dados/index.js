const Sequelize = require('sequelize')
const config = require("config")

const instancia = new Sequelize(
    config.get('postgres.banco-de-dados'),
    config.get('postgres.usuario'),
    config.get('postgres.senha'),
    {
        host: config.get('postgres.host'),
        dialect: 'postgres'
    }
)

module.exports = instancia