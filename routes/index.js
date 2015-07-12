var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var authorController = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

// Autoload de comandos con :quizId
// El objetivo es capturar los errores que se producen al no existir una pregunta.
// Cuando en la cabecera HTTP se referencia un recurso (pregunta) con quizId, 
// se ejecuta la función load() del controlador de errores: quizController.load().
// El método param() de express es el que hace la conexión: 
// router.param('quizId', quizController.load).
// [http://expressjs.com/4x/api.html#router.param]. 
router.param('quizId', quizController.load);


/* GET Definición de rutas de /quizes page. */
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new',					quizController.new);
router.post('/quizes/create',				quizController.create);

/* GET Author page. */
router.get('/author', authorController.author);

module.exports = router;
