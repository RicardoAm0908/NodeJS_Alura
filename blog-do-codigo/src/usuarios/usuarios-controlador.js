const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const jwt = require ('jsonwebtoken');
const blocklist = require('../../redis/manipula-blocklist');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const crypto = require('crypto');
const moment = require('moment');

function criaTokenJWT(usuario){
  const payload = {
    id: usuario.id
  };
  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: '15m' });
  return token;
}


async function criaTokenOpaco(usuario){
  const payload = {
    id: usuario.id
  }
  const tokenOpaco = crypto.randomBytes(24).toString('hex');
  const dataExpiracao = moment().add(5, 'd').unix();
  await allowlistRefreshToken.adiciona(tokenOpaco, usuario.id, dataExpiracao);
  return tokenOpaco;
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
      const accessToken = criaTokenJWT(req.user);
      const refreshToken = await criaTokenOpaco(req.user);
      res.set('Authorization', accessToken);
      res.status(200).json({refreshToken});
    }catch(ex){
      res.status(500).json({ erro: ex.message });
    }
  },

  logout: async (req, res) => {
    try{
      const token = req.token;
      await blocklist.adiciona(token);
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
