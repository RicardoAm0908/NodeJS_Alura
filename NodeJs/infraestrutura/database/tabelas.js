class Tabelas {
    init(conexao) {
        this.conexao = conexao
        this.criarAtendimentos()
        this.criarPets()
    }

    criarAtendimentos(){
        const sql = `
            CREATE SEQUENCE IF NOT EXISTS tb_atendimentos_id;

            CREATE TABLE IF NOT EXISTS tb_atendimentos (
            Id integer NOT NULL PRIMARY KEY DEFAULT NEXTVAL('tb_atendimentos_id'),
            Cliente varchar(11) NOT NULL, 
            Pet varchar(20),
            Servico varchar(20) NOT NULL,
            Data timestamp  NOT NULL,
            DataCriacao timestamp NOT NULL,
            Status varchar(20) NOT NULL,
            Observacoes text                
            );
            `
        this.conexao.query(sql, (erro) => {
            if(erro){
                console.log(erro)
            }else{
                console.log("Tabela atendimentos criada com sucesso")
            }
        })
    }

    criarPets(){
        const sql = `
        CREATE SEQUENCE IF NOT EXISTS tb_pets_id;
        CREATE TABLE IF NOT EXISTS tb_pets (
            Id integer NOT NULL PRIMARY KEY DEFAULT NEXTVAL('tb_pets_id'),
            Nome varchar(50) NOT NULL, 
            Imagem varchar(200)
        )
        `
        this.conexao.query(sql, (erro) =>{
            if(erro){
                console.log(erro)
            }else{
                console.log("Tabela pets criada com sucesso")
            }

        })
    }

}

module.exports = Tabelas