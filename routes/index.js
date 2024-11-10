const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Configuración de multer para almacenar las fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/dni')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Configuración de multer para almacenar las fotos de perfil
const storage_profile = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profile')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const uploadProfile = multer({ storage: storage_profile });

// Ruta para la página de login
router.get('/login', (req, res) => {
  res.render('index', { title: 'Login', error: null });
});

// Ruta POST para el inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Primero obtener el usuario
    const [users] = await db.promise().query(`
      SELECT 
        u.userid,
        u.nombre_user,
        u.password,
        u.estado,
        p.perfilid,
        p.tipo as tipo_perfil,
        p.permisos,
        per.nombre,
        per.apellido,
        per.personaid,
        per.foto_perfil
      FROM user u
      JOIN perfil p ON u.idperfil = p.perfilid
      LEFT JOIN persona per ON per.userid = u.userid
      WHERE u.nombre_user = ? AND u.estado = 1`,
      [username]
    );

    if (users.length === 0) {
      return res.render('index', { 
        title: 'Login', 
        error: 'Usuario o contraseña incorrectos' 
      });
    }

    const user = users[0];
    
    // Verificar la contraseña
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.render('index', { 
        title: 'Login', 
        error: 'Usuario o contraseña incorrectos' 
      });
    }

    req.session.user = {
      id: user.userid,
      nombre: user.nombre,
      apellido: user.apellido,
      username: user.nombre_user,
      tipo_perfil: user.tipo_perfil,
      foto_perfil: user.foto_perfil,
      isAdmin: user.tipo_perfil === 'admin',
      isMedico: user.tipo_perfil === 'medico',
      isSecretaria: user.tipo_perfil === 'secretaria',
      isPaciente: user.tipo_perfil === 'paciente'
    };
    
    res.redirect('/inicio');
  } catch (error) {
    console.error('Error en login:', error);
    res.render('index', { 
      title: 'Login', 
      error: 'Error en la base de datos' 
    });
  }
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar', error: null });
});

router.post('/register', upload.single('foto_dni'), async (req, res) => {
  const { 
    nombre, 
    apellido, 
    dni, 
    telefono, 
    username, 
    password,
    direccion,
    localidad 
  } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const foto_dni = req.file ? `/uploads/dni/${req.file.filename}` : null;

    // Verificación de usuario existente
    const [existingUser] = await db.promise().query(
      'SELECT * FROM persona WHERE dni = ? OR mail = ?',
      [dni, username]
    );

    if (existingUser.length > 0) {
      return res.render('register', { 
        title: 'Registro de Paciente', 
        error: 'Ya existe un paciente con ese DNI o email' 
      });
    }

    await db.promise().beginTransaction();

    // Crear usuario
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, estado, idperfil, createdAt, updateAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [username, hashedPassword, 1, 4]
    );

    const userid = userResult.insertId;

    // Crear persona
    await db.promise().query(
      'INSERT INTO persona (userid, dni, nombre, apellido, telefono, mail, direccion, localidad, foto_dni, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [userid, dni, nombre, apellido, telefono, username, direccion, localidad, foto_dni]
    );

    await db.promise().commit();
    res.redirect('/login');
  } catch (error) {
    await db.promise().rollback();
    console.error('Error en el registro:', error);
    
    res.render('register', { 
      title: 'Registro de Paciente', 
      error: 'Error al registrar el paciente. Por favor, intente nuevamente.' 
    });
  }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/'); // Redirige a la página de inicio
  });
});

// Ruta para la página de inicio
router.get('/inicio', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('inicio', { title: 'Inicio', user: req.session.user });
});

// Ruta para la página principal
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Agenda Médica',
    user: req.session.user 
  });
});

// Ruta para la página de perfil
router.get('/mi-perfil', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('miPerfil', {
    title: 'Mi Perfil',
    user: req.session.user
  });
});

router.post('/mi-perfil', uploadProfile.single('foto_perfil'), async (req, res) => {
  try {
    const { password, confirm_password } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;
    
    if (password && password !== confirm_password) {
      return res.render('miPerfil', {
        title: 'Mi Perfil',
        user: req.session.user,
        error: 'Las contraseñas no coinciden'
      });
    }

    // Actualizar contraseña si se proporcionó una nueva
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await db.promise().query(
        'UPDATE user SET password = ?, updateAt = NOW() WHERE userid = ?',
        [hashedPassword, req.session.user.id]
      );
    }

    // Actualizar foto de perfil si se subió una nueva
    if (foto_perfil) {
      await db.promise().query(
        'UPDATE persona SET foto_perfil = ?, updateAt = NOW() WHERE userid = ?',
        [foto_perfil, req.session.user.id]
      );
      req.session.user.foto_perfil = foto_perfil;
    }

    res.render('miPerfil', {
      title: 'Mi Perfil',
      user: req.session.user,
      success: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.render('miPerfil', {
      title: 'Mi Perfil',
      user: req.session.user,
      error: 'Error al actualizar el perfil'
    });
  }
});

module.exports = router;