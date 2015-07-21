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
