// Cargamos el Modelo del MVC para poder acceder a la DB
// models.js cargará, al ser invocado, la BD Quiz
var models = require('../models/models.js');

// Autoload :id de comentarios
// Se ejecuta si la URL incluye el parámetro commentId
exports.load = function(req, res, next, commentId) {
  models.Comment.find( { where: { id: Number(commentId) } })
    .then(
    function (comment) {
      if (comment) {
        req.comment = comment;
        next();
      } else { next(new Error('No existe commentId=' + commentId)); }
    }
  ).catch(function(error) {next(error);});  
};


//GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
  // Se invoca la vista new.ejs pasando como parámetro el Id del quiz actual
  res.render('comments/new.ejs', { quizId: req.params.quizId, errors: [] });
};


// POST /quizes/:quizId/comments
exports.create = function(req, res) {
  // Se crea el objeto comment con el texto tecleado y el quizId de la pregunta actual
  // La relación 1-a-N creada con belongsTo(...) en models.js aporta el quizId
  var comment = models.Comment.build( 
    { texto: req.body.comment.texto,
      QuizId: req.params.quizId
    } 
  );

  // Para salvar el problema .then no existente en .validate
  var errors = comment.validate();

  // Si hay errores, los tratamos
  if (errors) {
      // Se convierte errors en Array para poder tratarla con el código
      // propuesta en la práctica
      var errores = new Array();

      // Recorremos el nuevo Array de errores
      var i = 0;
      for (var prop in errors) errores[i++] = {message: errors[prop]};
      
      // Se reenvía la vista new con los errores encontrados
      res.render('comments/new.ejs', 
        {comment: comment, quizId: req.params.quizId, errors: errores});
  } else {
      // No hay error. Se guarda la pregunta en la DB
      // y se muestra la lista de preguntas actualizada
      comment
      .save()
      .then(function() { res.redirect('/quizes/'+req.params.quizId) })
  };    
};

//GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
  req.comment.publicado = true;

  req.comment.save( { fields: ["publicado"] } )
  .then ( function(){ res.redirect('/quizes/' + req.params.quizId); } )
  .catch( function(error) { next(error) } );
};
