var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var authorController = require('../controllers/author_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
// El objetivo es capturar los errores que se producen al no existir una pregunta.
// Cuando en la cabecera HTTP se referencia un recurso (pregunta) con quizId, 
// se ejecuta la función load() del controlador de errores: quizController.load().
// El método param() de express es el que hace la conexión: 
// router.param('quizId', quizController.load).
// [http://expressjs.com/4x/api.html#router.param]. 
router.param('quizId', quizController.load);

// GET Definición de rutas de sesión. 
router.get('/login',		sessionController.new);
router.post('/login',		sessionController.create);
router.get('/logout',		sessionController.destroy);
// router.delete('/logout',	sessionController.destroy);

// GET Definición de rutas de /quizes pages. 
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);
router.get('/quizes/new',					quizController.new);
router.post('/quizes/create',				quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	quizController.edit);
router.put('/quizes/:quizId(\\d+)',			quizController.update);
router.delete('/quizes/:quizId(\\d+)',		quizController.destroy);

// GET y POST para gestión de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);

/* GET Author page. */
router.get('/author', authorController.author);

// Exportamos nuestro encaminador para que pueda atender las peticiones
// que realicen los clientes
module.exports = router;
