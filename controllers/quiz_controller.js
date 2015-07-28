// Cargamos el Modelo del MVC para poder acceder a la DB
// models.js cargará, al ser invocado, la BD Quiz
var models = require('../models/models.js');

// Autoload :id
// Se ejecuta si la URL incluye el parámetro quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(
      { where: { id: Number(quizId) }, include: [{ model: models.Comment}] })
    .then(
		function (quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else { next(new Error('No existe quizId=' + quizId)); }
		}
	).catch(function(error) {next(error);});	
};


//GET /quizes?search=texto_a_buscar
// {where: ["pregunta like ?", search]}]
exports.index = function(req, res) {
  // Variable que contendrá la claúsula SQL de búsqueda
  // Se inicializa sin contenido, {}
  var where = {};

  // Variable que contendrá el valor introducido por teclado o vacío
  // si no se ha tecleado nada
  var search = req.query.search || '';

  // Si se ha tecleado algún patrón a buscar, se compone la claúsula SQL Where
  // Se sustituyen todos los blancos por un % seguido del texto a buscar y se inicia
  // y termina la cadena de búsqueda con %. 
  // Ejemplo: se busca la cadena "a i a e p". Se sustituye por '%a%i%a%e%p%'.
  // Se compone la siguiente sentencia SQL:
  // SELECT * FROM `Quizzes` WHERE pregunta like '%a%i%a%e%p%';
  // Y, finalmente, se mostrará la pregunta "Capital de Portugal" 
  if(req.query.search) {
    where = {where: ["pregunta like ?", '%' + search.replace(/ /g, '%') + '%']};
  }

  // Se realiza la búsqueda en la BD con la claúsula Where compuesta y se lanza
  // la vista index.ejs con el resultado obtenido
  models.Quiz.findAll(where).then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, query: search, errors: [] });
  }).catch(function(error) { next(error);} );
};


//GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show.ejs', { quiz: req.quiz, errors: [] });
};


//GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
				resultado = 'Correcto';
		} 
	res.render(
    'quizes/answer',
    { quiz: req.quiz,
      respuesta: resultado,
      errors: []
    }
  );
};


//GET /quizes/new
exports.new = function(req, res) {
  // Se crea el objeto quiz con los datos pregunta y respuesta nuevos
  var quiz = models.Quiz.build({pregunta: "Pregunta", respuesta: "Respuesta", categoria: "Otros"});

  res.render('quizes/new', { quiz: quiz, errors: [] });
};


// POST /quizes/create
exports.create = function(req, res) {
  // Se crea el objeto quiz con los datos pregunta y respuesta nuevos
  // cargados en la pantalla new
  var quiz = models.Quiz.build( req.body.quiz );

  // Para salvar el problema .then no existente en .validate
  var errors = quiz.validate();

  // Si hay errores, los tratamos
  if (errors) {
      // Se convierte errors en Array para poder tratarla con el código
      // propuesta en la práctica
      var errores = new Array();

      // Recorremos el nuevo Array de errores
      var i = 0;
      for (var prop in errors) errores[i++] = {message: errors[prop]};
      
      // Se reenvía la vista new con los errores encontrados
      res.render('quizes/new', {quiz: quiz, errors: errores});
  } else {
      // No hay error. Se guarda la pregunta en la DB
      // y se muestra la lista de preguntas actualizada
      quiz
      .save({fields: ["pregunta", "respuesta", "categoria"]})
      .then( function() { res.redirect('/quizes')});
  }
};


// GET /quizes/:id/edit
exports.edit = function(req, res) {
  // Se crea una variable que contendrá el objeto quiz
  var quiz = req.quiz;

  // Se envía la vista edit que editará la pregunta actual
  res.render('quizes/edit', {quiz: quiz, errors: [] });
};


// PUT /quizes/:id
exports.update = function(req, res) {
  // Se cargan los datos que llegan del body
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.categoria = req.body.quiz.categoria;

/*
  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: errores});
      } else {
        req.quiz // save: guarda campos pregunta y respuesta en DB 
        .save({fields: ["pregunta", "respuesta", "categoria"]})
        .then( function(){ res.redirect('/quizes')}) ;
      } 
    }
  );
};
*/

  // Para salvar el problema .then no existente en .validate
  var errors = req.quiz.validate();

  // Si hay errores, los tratamos
  if (errors) {
      // Se convierte errors en Array para poder tratarla con el código
      // propuesto en la práctica
      var errores = new Array();

      // Recorremos el nuevo Array de errores
      var i = 0;
      for (var prop in errors) errores[i++] = {message: errors[prop]};
      
      // Se reenvía la vista new con los errores encontrados
      res.render('quizes/edit', {quiz: req.quiz, errors: errores});
  } else {
      // No hay error. Se guarda la pregunta en la DB
      // y se muestra la lista de preguntas actualizada
      req.quiz
      .save({fields: ["pregunta", "respuesta", "categoria"]})
      .then( function() { res.redirect('/quizes')});
  }  
};


// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then(function() {res.redirect('/quizes');})
  .catch(function(error){next(error)});
};