// Definición del modelo de Quiz
module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Quiz',
		{ 
			pregunta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta pregunta"}},
				validate: { notContains: "Pregunta"}
			}, 
			respuesta: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta respuesta"}},
				validate: { notContains: "Respuesta"}
			}, 
			categoria: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "-> Falta categoría"}},
				validate: { notContains: "Categoría"}
			}
		}		
	);
}