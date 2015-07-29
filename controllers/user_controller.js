// Se predefinen dos usuarios (admin y pepe)
var users = { admin: {id:1, username:"admin", password:"1234"},
              pepe:  {id:2, username:"pepe",  password:"5678"}
            };

// Se comprueba si el usuario existe en users
// Si lo está, devuelve sus datos
// En caso, se lanza una excepción con el error correspondiente
exports.autenticar = function(login, password, callback) {
  //console.log("login:"+login+" password:"+password);
  if (users[login]) {
      if (password === users[login].password) {
            console.log("¡Login y password encontrados!");
            callback(null, users[login]);
      }
      else { callback(new Error('Password erróneo.')); }
  } else { callback(new Error('No existe el usuario.')); }
};