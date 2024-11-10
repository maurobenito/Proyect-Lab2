// models/Sucursal.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Sucursal extends Model {}

Sucursal.init({
    sucursalid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_sucursal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Sucursal',
    tableName: 'sucursal',
    timestamps: true,
});

module.exports = Sucursal;
