const usuariosControlador = require('./usuarios-controlador');
const middlewareAutenticacao = require('./middlewares-autenticacao');

module.exports = app => {
  app
    .route('/usuario/login')
    .post(
      middlewareAutenticacao.local,
      usuariosControlador.login
    );
  
  app
    .route('/usuario/logout')
    .post(
      [middlewareAutenticacao.bearer, middlewareAutenticacao.refresh], 
      usuariosControlador.logout
  );

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id').delete(middlewareAutenticacao.bearer, usuariosControlador.deleta);

  app.route('/usuario/atualiza_token').post(middlewareAutenticacao.refresh, usuariosControlador.login);

  app.route('/usuario/verifica_email/:token').get(middlewareAutenticacao.verificacaoEmail, usuariosControlador.verificaEmail);
};
  