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

router.get('/', isAdmin, async (req, res) => {
  try {
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
    );
    
    res.render('medicos', { 
      title: 'Gestión de Profesionales',
      user: req.session.user,
      especialidades: especialidades,
      error: null
    });
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).send('Error al obtener especialidades');
  }
});

router.post('/agregar', isAdmin, async (req, res) => {
  const { nombre, apellido, dni, especialidad, matricula, email, telefono, direccion, localidad } = req.body;
  
  try {
    // Validar campos requeridos
    if (!especialidad || !matricula) {
      const [especialidades] = await db.promise().query(
        'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
      );
      
      return res.render('medicos', {
        title: 'Gestión de Profesionales',
        user: req.session.user,
        especialidades: especialidades,
        error: 'La especialidad y matrícula son campos obligatorios'
      });
    }

    // Validar que el DNI y email no existan
    const [existingUser] = await db.promise().query(
      'SELECT p.dni, u.nombre_user FROM persona p JOIN user u ON p.userid = u.userid WHERE p.dni = ? OR u.nombre_user = ?',
      [dni, email]
    );

    if (existingUser.length > 0) {
      const [especialidades] = await db.promise().query(
        'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
      );
      
      return res.render('medicos', {
        title: 'Gestión de Profesionales',
        user: req.session.user,
        especialidades: especialidades,
        error: 'Ya existe un usuario con ese DNI o email'
      });
    }

    await db.promise().beginTransaction();

    // Encriptar el DNI antes de usarlo como contraseña
    const hashedPassword = await bcrypt.hash(dni, saltRounds);

    // Crear usuario con la contraseña encriptada
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, idperfil, estado, createdAt, updateAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, 2, 1]
    );
    
    const userId = userResult.insertId;

    // 2. Ahora insertar en la tabla persona con el userid
    const [personaResult] = await db.promise().query(
      'INSERT INTO persona (nombre, apellido, dni, mail, telefono, userid, direccion, localidad, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nombre, apellido, dni, email, telefono, userId, direccion, localidad]
    );
    
    const personaId = personaResult.insertId;
    
    // 3. Insertar en la tabla medicos
    const [medicoResult] = await db.promise().query(
      'INSERT INTO medicos (personaid, especialidadId, estado, createdAt, updateAt) VALUES (?, ?, 1, NOW(), NOW())',
      [personaId, especialidad]
    );
    
    const medicoId = medicoResult.insertId;
    
    // 4. Insertar en la tabla medico_esp
    await db.promise().query(
      'INSERT INTO medico_esp (matricula, medicoid, especialidadid, createdAt, updateAt) VALUES (?, ?, ?, NOW(), NOW())',
      [matricula, medicoId, especialidad]
    );
    
    await db.promise().commit();
    
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
    );
    
    res.render('medicos', {
      title: 'Gestión de Profesionales',
      user: req.session.user,
      especialidades: especialidades,
      success: `Profesional agregado exitosamente.\nCredenciales de acceso:\nUsuario: ${email}\nContraseña: ${dni}`,
      error: null
    });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al agregar médico:', error);
    
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
    );
    
    res.render('medicos', {
      title: 'Gestión de Profesionales',
      user: req.session.user,
      especialidades: especialidades,
      error: 'Error al agregar el médico. Por favor, intente nuevamente.'
    });
  }
});

// Ruta para mostrar la página de especialidades
router.get('/especialidades', isAdmin, async (req, res) => {
  try {
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp, estado FROM especialidad ORDER BY nombre_esp'
    );
    
    res.render('especialidades', {
      title: 'Gestión de Especialidades',
      user: req.session.user,
      especialidades: especialidades,
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.render('especialidades', {
      title: 'Gestión de Especialidades',
      user: req.session.user,
      error: 'Error al cargar las especialidades'
    });
  }
});

// Ruta para agregar especialidad
router.post('/especialidad/agregar', isAdmin, async (req, res) => {
  const { nombre_esp } = req.body;
  
  try {
    // Verificar si ya existe la especialidad
    const [existing] = await db.promise().query(
      'SELECT nombre_esp FROM especialidad WHERE nombre_esp = ?',
      [nombre_esp]
    );

    if (existing.length > 0) {
      const [especialidades] = await db.promise().query(
        'SELECT especialidadId, nombre_esp, estado FROM especialidad ORDER BY nombre_esp'
      );
      
      return res.render('especialidades', {
        title: 'Gestión de Especialidades',
        user: req.session.user,
        especialidades: especialidades,
        error: 'La especialidad ya existe'
      });
    }

    // Insertar nueva especialidad
    await db.promise().query(
      'INSERT INTO especialidad (nombre_esp, estado, createdAt, updateAt) VALUES (?, 1, NOW(), NOW())',
      [nombre_esp]
    );

    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp, estado FROM especialidad ORDER BY nombre_esp'
    );

    res.render('especialidades', {
      title: 'Gestión de Especialidades',
      user: req.session.user,
      especialidades: especialidades,
      success: 'Especialidad agregada exitosamente'
    });
  } catch (error) {
    console.error('Error al agregar especialidad:', error);
    res.render('especialidades', {
      title: 'Gestión de Especialidades',
      user: req.session.user,
      error: 'Error al agregar la especialidad'
    });
  }
});

// Ruta para desactivar especialidad
router.post('/especialidad/toggle/:id', isAdmin, async (req, res) => {
  try {
    const [especialidad] = await db.promise().query(
      'SELECT estado FROM especialidad WHERE especialidadId = ?',
      [req.params.id]
    );
    
    const nuevoEstado = !especialidad[0].estado;
    
    await db.promise().query(
      'UPDATE especialidad SET estado = ?, updateAt = NOW() WHERE especialidadId = ?',
      [nuevoEstado, req.params.id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al cambiar estado de la especialidad' });
  }
});

// Ruta para obtener estado de especialidad
router.get('/especialidad/:id', isAdmin, async (req, res) => {
  try {
    const [especialidad] = await db.promise().query(
      'SELECT estado FROM especialidad WHERE especialidadId = ?',
      [req.params.id]
    );
    
    if (especialidad.length > 0) {
      res.json({ estado: especialidad[0].estado });
    } else {
      res.status(404).json({ error: 'Especialidad no encontrada' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener estado de la especialidad' });
  }
});

// Ruta para toggle estado de especialidad
router.post('/especialidad/toggle/:id', isAdmin, async (req, res) => {
  try {
    const [especialidad] = await db.promise().query(
      'SELECT estado FROM especialidad WHERE especialidadId = ?',
      [req.params.id]
    );
    
    if (especialidad.length > 0) {
      const nuevoEstado = !especialidad[0].estado;
      await db.promise().query(
        'UPDATE especialidad SET estado = ?, updateAt = NOW() WHERE especialidadId = ?',
        [nuevoEstado, req.params.id]
      );
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Especialidad no encontrada' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al cambiar estado de la especialidad' });
  }
});

module.exports = router;