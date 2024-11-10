const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware para autenticar
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login'); // Redirige a login si no está autenticado
}

// Ruta GET para mostrar la vista del calendario
router.get('/', isAuthenticated, (req, res) => {
  res.render('agenda', { 
    title: 'Agenda Médica',
    user: req.session.user 
  });
});

module.exports = router;