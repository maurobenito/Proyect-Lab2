const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'brakerwh6icdoo3gzlcn-mysql.services.clever-cloud.com',     
    user: 'ux5isqkxtkpks5a7',   
    password: 'XO8wFbgDVvrXTxqiniqh', 
    database: 'brakerwh6icdoo3gzlcn'   
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos como id ' + connection.threadId + ' - ' + connection.config.database);
});

module.exports = connection;
