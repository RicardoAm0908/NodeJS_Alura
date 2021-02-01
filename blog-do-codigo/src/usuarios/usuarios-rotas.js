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
    .get(
      middlewareAutenticacao.bearer, 
      usuariosControlador.logout
  );

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id').delete(middlewareAutenticacao.bearer, usuariosControlador.deleta);
};
  