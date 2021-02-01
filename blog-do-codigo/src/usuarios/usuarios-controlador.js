const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require ('jsonwebtoken');
const blacklist = require('../../redis/manipula-blacklist');


function criaTokenJWT(usuario){
  const payload = {
    id: usuario.id
  };
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' });
  return token;
}

module.exports = {
  adiciona: async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

      res.status(201).json();
    } catch (ex) {
      if (ex instanceof InvalidArgumentError) {
        res.status(422).json({ ex: erro.message });
      } else if (ex instanceof InternalServerError) {
        res.status(500).json({ ex: erro.message });
      } else {
        res.status(500).json({ ex: erro.message });
      }
    }
  },

  login: (req, res) => {
    const token = criaTokenJWT(req.user);
    res.set('Authorization', token);
    res.status(204).send();
  },

  logout: async (req, res) => {
    try{
      const token = req.token;
      await blacklist.adiciona(token);
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
  }
};
