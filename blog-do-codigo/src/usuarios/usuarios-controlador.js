const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const blocklist = require('../../redis/blocklist-access-token');
const tokens = require('./tokens');
const { EmailVerificacao } = require('./emails');

function geraEndereco(rota, token){
  const baseURL = process.env.BASE_URL;
  return `${baseURL}/${rota}/${token}`;
}


module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

      const token = tokens.verificacaoEmail.cria(usuario.id);
      const endereco = geraEndereco('usuario/verifica_email', token);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail().catch(console.log);

      res.status(201).json();
    } catch (ex) {
      if (ex instanceof InvalidArgumentError) {
        res.status(422).json({ erro: ex.message });
      } else if (ex instanceof InternalServerError) {
        res.status(500).json({ erro: ex.message });
      } else {
        res.status(500).json({ erro: ex.message });
      }
    }
  },

  login:  async(req, res) => {
    try{
      const accessToken = tokens.access.cria(req.user.id);
      const refreshToken = await tokens.refresh.cria(req.user.id);
      res.set('Authorization', accessToken);
      res.status(200).json({refreshToken});
    }catch(ex){
      res.status(500).json({ erro: ex.message });
    }
  },

  logout: async (req, res) => {
    try{
      const token = req.token;
      tokens.access.invalida(token);
      res.status(204).send();
    }catch(ex){
      res.status(500).json({erro: ex.message})
    }
  },

  lista: async (req, res) => {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  deleta: async (req, res) => {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (ex) {
      res.status(500).json({ erro: ex });
    }
  },

  verificaEmail: async(req, res) => {
    try{
      const usuario = req.user;
      await usuario.verificaEmail();
      res.status(200).json();
    }catch (ex) {
      res.status(500).json({ erro: ex.message });
    }
  }
};
