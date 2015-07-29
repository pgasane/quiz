var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// soporte para vistas parciales
app.use(partials());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());

// Para lo métodos POST
//app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

// Se indica una semilla para el cifrado de cookies
// Mejor sería generar una clave aleatoria completa
app.use(cookieParser('Quiz 2015'));

// Para la gestión de sesiones de usuario
//app.use(session());
app.use(session({secret: 'semilla', resave: false, saveUninitialized: true}));

// Para la operación de Borrado de preguntas
app.use(methodOverride('_method'));

// Define la existencia del middleware stático en el recurso public
app.use(express.static(path.join(__dirname, 'public')));


// Auto-logout si la sesión está inactiva más de 2 minutos entre transacciones
app.use(function(req, res, next) {
    // Si hay un usuario autenticado
    if(req.session.user) {
        // Si no hay registro del tiempo de actividad, se crea
        if (!req.session.counterTime) {
            req.session.counterTime = (new Date()).getTime();
            req.session.secondsToLogout = 120;
        } else {
            // Si hay registro, comprobamos si han pasados 2 minutos sin actividad
            if ((new Date()).getTime() - req.session.counterTime > 120000) {
                // Si es así, se destruye el usuario (la sesión) y el contador de tiempo
                console.log("La sesión de " + req.session.user.username + " ha caducado.");
                delete req.session.user;
                delete req.session.counterTime;
            } else {
                // Si NO han pasado 2 minutos entre transacciones, se actualiza el contador
                // de tiempo
                req.session.counterTime = (new Date()).getTime();
                req.session.secondsToLogout = 120;
            }
        }
    }
    // En este punto la sessión está activa y no se ha superado el tiempo de inactividad
    // por lo que podemos seguir ejecundo los demás MW
    next();
});

// Helpers dinámicos :
// Guardar path anterior al Login
// Hacer visible la sessión a las vistas de la app
app.use(function(req, res, next) {
    // Guardar path anterior
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    // Para que se sigan procesando los middleware
    next();
});

// Debe ir al final de todas las gestiones de las rutas
// para tratar como errores todas las no definidas
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
