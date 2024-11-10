const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Configurar multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/dni')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

async function validateUserData(db, dni, email) {
  // Validar DNI
  const [existingDNI] = await db.promise().query(
    'SELECT dni FROM persona WHERE dni = ?',
    [dni]
  );

  if (existingDNI.length > 0) {
    return { error: 'Ya existe un usuario con ese DNI' };
  }

  // Validar email
  const [existingEmail] = await db.promise().query(
    'SELECT nombre_user FROM user WHERE nombre_user = ?',
    [email]
  );

  if (existingEmail.length > 0) {
    return { error: 'Ya existe un usuario con ese email' };
  }

  return null;
}

router.get('/', async (req, res) => {
  try {
    const [pacientes] = await db.promise().query(`
      SELECT 
        p.*,
        u.userid,
        u.estado
      FROM persona p
      JOIN user u ON p.userid = u.userid
      JOIN perfil pf ON u.idperfil = pf.perfilid
      WHERE pf.tipo = 'paciente'
      ORDER BY p.apellido, p.nombre
    `);

    res.render('pacientes', {
      title: 'Lista de Pacientes',
      user: req.session.user,
      pacientes: pacientes,
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.render('pacientes', {
      title: 'Lista de Pacientes',
      user: req.session.user,
      pacientes: [],
      error: 'Error al cargar la lista de pacientes'
    });
  }
});

router.get('/agregar', (req, res) => {
  res.render('paciente', { 
    title: 'Agregar Paciente',
    user: req.session.user,
    error: null,
    success: null
  });
});

router.post('/agregar', upload.single('foto_dni'), async (req, res) => {
  const { nombre, apellido, dni, email, telefono, direccion, localidad } = req.body;
  const foto_dni = req.file ? req.file.filename : null;
  
  try {
    const validationError = await validateUserData(db, dni, email);
    if (validationError) {
      return res.render('paciente', {
        title: 'Agregar Paciente',
        user: req.session.user,
        error: validationError.error
      });
    }

    await db.promise().beginTransaction();

    // Encriptar el DNI antes de usarlo como contraseña
    const hashedPassword = await bcrypt.hash(dni, saltRounds);

    // 1. Crear usuario con la contraseña encriptada
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, idperfil, estado, createdAt, updateAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, 4, 1]
    );
    
    const userId = userResult.insertId;

    // 2. Insertar en la tabla persona
    const [personaResult] = await db.promise().query(
      'INSERT INTO persona (nombre, apellido, dni, mail, telefono, foto_dni, userid, direccion, localidad, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nombre, apellido, dni, email, telefono, foto_dni, userId, direccion, localidad]
    );

    await db.promise().commit();
    
    res.render('paciente', {
      title: 'Agregar Paciente',
      user: req.session.user,
      success: `Paciente agregado exitosamente.\nCredenciales de acceso:\nUsuario: ${email}\nContraseña: ${dni}`,
      error: null
    });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al agregar paciente:', error);
    res.render('paciente', {
      title: 'Agregar Paciente',
      user: req.session.user,
      error: 'Error al agregar el paciente. Por favor, intente nuevamente.'
    });
  }
});

// Ruta para listar todos los pacientes
router.get('/pacientes', async (req, res) => {
  try {
    const [pacientes] = await db.promise().query(`
      SELECT 
        p.*,
        u.userid,
        u.estado
      FROM persona p
      JOIN user u ON p.userid = u.userid
      JOIN perfil pf ON u.idperfil = pf.perfilid
      WHERE pf.tipo = 'paciente'
      ORDER BY p.apellido, p.nombre
    `);

    res.render('pacientes', {
      title: 'Lista de Pacientes',
      user: req.session.user,
      pacientes: pacientes,
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.render('pacientes', {
      title: 'Lista de Pacientes',
      user: req.session.user,
      pacientes: [],
      error: 'Error al cargar la lista de pacientes'
    });
  }
});

// Ruta para cambiar estado del paciente
router.post('/toggle-status/:id', async (req, res) => {
  try {
    const { estado } = req.body;
    await db.promise().query(
      'UPDATE user SET estado = ?, updateAt = NOW() WHERE userid = ?',
      [estado, req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar el estado del paciente' });
  }
});

// Ruta para mostrar formulario de edición
router.get('/editar/:id', async (req, res) => {
  try {
    const [paciente] = await db.promise().query(`
      SELECT 
        p.*,
        u.userid,
        u.estado,
        u.nombre_user as email
      FROM persona p
      JOIN user u ON p.userid = u.userid
      JOIN perfil pf ON u.idperfil = pf.perfilid
      WHERE u.userid = ? AND pf.tipo = 'paciente'
    `, [req.params.id]);

    if (!paciente[0]) {
      return res.redirect('/paciente');
    }

    res.render('editarPaciente', {
      title: 'Editar Paciente',
      user: req.session.user,
      paciente: {
        ...paciente[0],
        mail: paciente[0].email // aseguramos que el email se muestre en el campo correcto
      },
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Error al obtener datos del paciente:', error);
    res.redirect('/paciente');
  }
});

// Ruta para procesar la edición
router.post('/editar/:id', async (req, res) => {
  const { nombre, apellido, dni, email, telefono, direccion, localidad } = req.body;
  
  try {
    await db.promise().beginTransaction();

    // Actualizar datos en la tabla persona
    await db.promise().query(
      'UPDATE persona SET nombre=?, apellido=?, dni=?, mail=?, telefono=?, direccion=?, localidad=?, updateAt=NOW() WHERE userid=?',
      [nombre, apellido, dni, email, telefono, direccion, localidad, req.params.id]
    );

    // Actualizar email en la tabla user
    await db.promise().query(
      'UPDATE user SET nombre_user=?, updateAt=NOW() WHERE userid=?',
      [email, req.params.id]
    );

    await db.promise().commit();
    res.redirect('/paciente');
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al actualizar paciente:', error);
    
    const [paciente] = await db.promise().query(
      'SELECT * FROM persona WHERE userid = ?',
      [req.params.id]
    );

    res.render('editarPaciente', {
      title: 'Editar Paciente',
      user: req.session.user,
      paciente: paciente[0],
      error: 'Error al actualizar los datos. Por favor, intente nuevamente.'
    });
  }
});

module.exports = router;
