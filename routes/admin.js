const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Middleware para verificar si es admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.redirect('/inicio');
}

// Ruta para mostrar el formulario de crear admin
router.get('/crear', isAdmin, (req, res) => {
  res.render('crearAdmin', {
    title: 'Crear Administrador',
    user: req.session.user,
    error: null,
    success: null
  });
});

// Ruta para procesar la creación de admin
router.post('/crear', isAdmin, async (req, res) => {
  const { 
    nombre, 
    apellido, 
    dni, 
    email, 
    password,
    confirm_password,
    telefono, 
    direccion, 
    localidad 
  } = req.body;
  
  try {
    // Validar que las contraseñas coincidan
    if (password !== confirm_password) {
      return res.render('crearAdmin', {
        title: 'Crear Administrador',
        user: req.session.user,
        error: 'Las contraseñas no coinciden'
      });
    }

    // Validar que el DNI y email no existan
    const [existingUser] = await db.promise().query(
      'SELECT p.dni, u.nombre_user FROM persona p JOIN user u ON p.userid = u.userid WHERE p.dni = ? OR u.nombre_user = ?',
      [dni, email]
    );

    if (existingUser.length > 0) {
      return res.render('crearAdmin', {
        title: 'Crear Administrador',
        user: req.session.user,
        error: 'Ya existe un usuario con ese DNI o email'
      });
    }

    await db.promise().beginTransaction();

    // Encriptar la contraseña ingresada
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, idperfil, estado, createdAt, updateAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, 1, 1] // idperfil 1 para admin
    );
    
    const userId = userResult.insertId;

    // Crear persona
    await db.promise().query(
      'INSERT INTO persona (nombre, apellido, dni, mail, telefono, userid, direccion, localidad, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nombre, apellido, dni, email, telefono, userId, direccion, localidad]
    );

    await db.promise().commit();
    
    res.render('crearAdmin', {
      title: 'Crear Administrador',
      user: req.session.user,
      success: `Administrador creado exitosamente.\nCredenciales de acceso:\nUsuario: ${email}`,
      error: null
    });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al crear administrador:', error);
    res.render('crearAdmin', {
      title: 'Crear Administrador',
      user: req.session.user,
      error: 'Error al crear el administrador'
    });
  }
});

module.exports = router;
