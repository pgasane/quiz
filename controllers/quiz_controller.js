// Cargamos el Modelo del MVC para poder acceder a la DB
// models.js cargará, al ser invocado, la BD Quiz
var models = require('../models/models.js');

// Autoload que se ejecuta si la URL incluye el parámetro quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
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
    res.render('quizes/index.ejs', {quizes: quizes, query: search});
  }).catch(function(error) { next(error);} );
};


//GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};


//GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
				resultado = 'Correcto';
		} 
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};