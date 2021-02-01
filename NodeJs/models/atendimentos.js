const conexao = require('../infraestrutura/database/conexao')
const moment = require('moment')
const repositorio = require("../repositorios/atendimentos")
const { default: axios } = require('axios')

class Atendimento {
    constructor(){
        this.validaData = ({data, dataCriacao}) => data >= dataCriacao
        this.validaCliente = (tamanho) => tamanho >= 5 
        this.valida = parametros => this.validacoes.filter(campo  => {
            const { nome } = campo.nome
            const parametro = parametros[nome]
            return !campo.valido(parametro)
        })

        this.validacoes = [
            {
                nome: 'Data',
                mensagem: 'Data deve ser maior ou igual a data atual',
                valido: this.validaData
            },
            {
                nome: 'Cliente',
                mensagem: 'O Cliente deve possuir no mínimo 5 caracteres',
                valido: this.validaCliente
            }
        ]
    }


    adiciona(atendimento){        
        const dataCriacao = moment().format('DD/MM/YYYY hh:mm:ss')
        const dadosAtendimento = {...atendimento, dataCriacao}
        const data = moment(dadosAtendimento.Data, 'DD/MM/YYYY').format('DD/MM/YYYY hh:mm:ss')      

        const parametros = {
            data: { data, dataCriacao},
            cliente: { tamanho: atendimento.cliente.length }
        }

        const erros = this.valida(parametros)
        if(erros.length > 0){
            return new Promise((resolve, reject) => reject(erros))
        }

        return repositorio.adiciona(Object.values(dadosAtendimento))
            .then( resultados => {
                return {dadosAtendimento, resultados}
            })
    }

    lista(){
        return repositorio.lista()
            .then( resultados => {
                return {resultados}
            })
    }

    buscarPorId(id){
        return repositorio.buscarPorId(id)
            .then( resultados => {                    
                return {resultados}               
            })
    }

    altera(id, valores, res){
        if(valores.data){
            valores.Data = moment(valores.Data, 'DD/MM/YYYY').format('DD/MM/YYYY HH:MM:SS')
        }
        const nomes = Object.keys(valores)
        var string = ""
        //Isso é necessário, pois com o postgres é preciso setar o campo = valor, não pode passar o objeto todo (com chave/valor), como é feito no MySql
        for(var i = 0; i<nomes.length; i++){
            string += nomes[i] + ` = $${i+1}`
            if(i < nomes.length - 1){
                string += ","
            }
        }
        const sql = `UPDATE tb_atendimentos SET ${string} WHERE id= ${id}`        
        conexao.query(sql, Object.values(valores),(erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({...valores, id})
            }
        })

    }

    deleta(id, res){
        const sql = `DELETE FROM tb_atendimentos  WHERE id= $1`        
        conexao.query(sql, [id], (erro, resultados) => {
            if(erro){
                res.status(400).json(erro)
            }else{
                res.status(200).json({id})
            }
        })
    }
}

module.exports = new Atendimento