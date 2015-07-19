// Se manejan rutas por lo que necesitamos cargar path
var path = require('path');

// Postgress DATABASE_URL = postgress://user:passwd@host:port/database
// sqlite    DATABASE_URL = sqlite://://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user	 = (url[2]||null);
var pwd		 = (url[3]||null);
var protocol = (url[1]||null);
var dialect	 = (url[1]||null);
var port 	 = (url[5]||null);
var host	 = (url[4]||null);
var storage	 = process.env.DATABASE_STORAGE;

// models.js construye la DB y el modelo a partir de lo indicado en quiz.js
// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar DB SQLite o Postgress
var sequelize = new Sequelize(DB_name, user, pwd, 
	{ dialect:  protocol,
	  protocol: protocol,
	  port:     port,
	  host:     host,
	  storage:  storage, // solo en SQLite (.env)
	  omitNull: true     // solo en Postgres
	}
);


// Importar la definición de la tabla Quiz hecha en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment hecha en comment.js
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

// Establecer la relación 1-a-N con la tabla Quiz
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar la definición de la tabla Quiz para que sea posible accedar a
// la tabla desde otras partes de la aplicación con el import correspondiente
exports.Quiz = Quiz;

// Exportar la definición de la tabla Comment para que sea posible accedar a
// la tabla desde otras partes de la aplicación con el import correspondiente
exports.Comment = Comment;

// Inicializar la tabla de preguntas en la DB solo si está vacía
// success() ejecuta el manejador una vez creada la tabla
sequelize.sync().success(function(){
	Quiz.count().success(function(count){
		if (count < 2) {
			
			Quiz.create({pregunta: 'Capital de Italia',
						 respuesta: 'Roma',
						 categoria: 'Humanidades'});

			Quiz.create({pregunta: 'Capital de Portugal',
						 respuesta: 'Lisboa',
						 categoria: 'Humanidades'})
			.then(function(){console.log('Base de datos inicializada.')});
		};
	});
});