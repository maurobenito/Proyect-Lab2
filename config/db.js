const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',     
    user: 'root',   
    password: '', 
    database: 'turnos_medicos'   
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos como id ' + connection.threadId + ' - ' + connection.config.database);
});

module.exports = connection;
