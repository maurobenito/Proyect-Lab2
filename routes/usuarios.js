const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profile')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Middleware para verificar si es admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.redirect('/inicio');
}

// Listar usuarios
router.get('/', isAdmin, async (req, res) => {
  try {
    const [usuarios] = await db.promise().query(`
      SELECT 
        u.userid, 
        u.nombre_user, 
        u.estado,
        p.nombre,
        p.apellido,
        p.foto_perfil,
        pf.tipo as tipo_perfil
      FROM user u
      LEFT JOIN persona p ON p.userid = u.userid
      JOIN perfil pf ON pf.perfilid = u.idperfil
      ORDER BY u.userid DESC
    `);

    res.render('usuarios', {
      title: 'Gestión de Usuarios',
      user: req.session.user,
      usuarios,
      error: null,
      success: null
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.render('usuarios', {
      title: 'Gestión de Usuarios',
      user: req.session.user,
      usuarios: [],
      error: 'Error al cargar la lista de usuarios'
    });
  }
});

// Editar usuario
router.get('/editar/:id', isAdmin, (req, res) => {
  const userId = req.params.id;
  db.query(`
    SELECT 
      u.*,
      p.tipo as tipo_perfil,
      per.foto_perfil,
      per.nombre,
      per.apellido
    FROM user u
    JOIN perfil p ON u.idperfil = p.perfilid
    LEFT JOIN persona per ON per.userid = u.userid
    WHERE u.userid = ?
  `, [userId], (err, usuario) => {
    if (err || !usuario[0]) {
      return res.redirect('/usuarios');
    }
    res.render('editarUsuario', {
      title: 'Editar Usuario',
      user: req.session.user,
      usuario: usuario[0]
    });
  });
});

router.post('/editar/:id', upload.single('foto_perfil'), async (req, res) => {
  try {
    const { username, password, tipo } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;
    
    // Si hay una nueva foto, actualizarla
    if (foto_perfil) {
      await db.promise().query(
        'UPDATE persona SET foto_perfil = ? WHERE userid = ?',
        [foto_perfil, req.params.id]
      );
    }
    
    // Primero obtener el perfilid basado en el tipo
    db.query('SELECT perfilid FROM perfil WHERE tipo = ?', [tipo], async (err, perfil) => {
      if (err || !perfil[0]) {
        return res.render('editarUsuario', {
          error: 'Error al actualizar usuario',
          user: req.session.user,
          usuario: req.body
        });
      }

      try {
        // Si hay contraseña nueva, encriptarla
        let updateData;
        let query;
        
        if (password) {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          updateData = [username, hashedPassword, perfil[0].perfilid, req.params.id];
          query = 'UPDATE user SET nombre_user = ?, password = ?, idperfil = ?, updateAt = NOW() WHERE userid = ?';
        } else {
          updateData = [username, perfil[0].perfilid, req.params.id];
          query = 'UPDATE user SET nombre_user = ?, idperfil = ?, updateAt = NOW() WHERE userid = ?';
        }

        await db.promise().query(query, updateData);
        res.redirect('/usuarios');
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.render('editarUsuario', {
          error: 'Error al actualizar usuario',
          user: req.session.user,
          usuario: req.body
        });
      }
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.render('editarUsuario', {
      error: 'Error al actualizar usuario',
      user: req.session.user,
      usuario: req.body
    });
  }
});

// Ruta para cambiar el estado del usuario
router.post('/toggle-status/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  try {
    await db.promise().query(
      'UPDATE user SET estado = ?, updateAt = NOW() WHERE userid = ?',
      [estado, id]
    );
    
    res.json({ success: true, message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar el estado del usuario' 
    });
  }
});

module.exports = router; 