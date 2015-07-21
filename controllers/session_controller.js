// GET /login  -- Formulario de login
exports.new = function(req, res) {
  // Se crea y/o inicializa la variable de errores de sesión
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new', { errors: errors });
};


// POST /login  -- Crear la sesión
exports.create = function(req, res) {
  // Creamos variables con el contenido login y password del formulario
  var login     = req.body.login;
  var password  = req.body.password;
  
  // Gestionamos el control de la sesión en el create directamente
  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    // En caso de errores los retornamos
    if (error) {
      req.session.errors = [{"message": 'Se ha producido un error: '+error}];
      res.redirect("/login");
      // Y terminamos el proceso
      return;
    }

    // Si no hay errrores, creamos la sesión
    req.session.user = {id:user.id, username:user.username};

    // Y retornamos al path anterior al login
    res.redirect(req.session.redir.toString());
  });
};


// DELETE /logout  -- Destruir sessión
exports.destroy = function(req, res) {
  // Se destruye la sesión
  delete req.session.user;
  // y retornamos al path anterior al login
  res.redirect(req.session.redir.toString());
};