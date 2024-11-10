const express = require('express');
const path = require('path');
const session = require('express-session');
const indexRouter = require('./routes/index');
const agendaRouter = require('./routes/agenda');
const pacienteRouter = require('./routes/paciente');
const medicosRouter = require('./routes/medicos');
const usuariosRouter = require('./routes/usuarios');
const adminRouter = require('./routes/admin');
const secretariaRouter = require('./routes/secretaria');

const app = express();

// Configuración de sesión
app.use(session({
  secret: 'perro',
  resave: false,
  saveUninitialized: false
}));

// Middleware para hacer el usuario disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Solo una vez para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/inicio');
  } else {
    res.render('landing', { title: 'Bienvenido' });
  }
});

app.use('/', indexRouter);
app.use('/agenda', agendaRouter);
app.use('/paciente', pacienteRouter);
app.use('/pacientes', pacienteRouter);
app.use('/medicos', medicosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/admin', adminRouter);
app.use('/secretaria', secretariaRouter);

// Captura el error 404
app.use((req, res, next) => {
  const err = new Error('Página no encontrada');
  err.status = 404;
  next(err);
});

// Manejador de errores
app.use((err, req, res, next) => {
  // Configura el estado del error
  res.status(err.status || 500);
  
  res.render('error', { 
    title: err.status === 404 ? 'Página no encontrada' : 'Error',
    message: err.status === 404 ? 'Lo sentimos, la página que buscas no existe.' : err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;

