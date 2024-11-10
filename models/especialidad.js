// models/Especialidad.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Especialidad extends Model {}

Especialidad.init({
    especialidadId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_esp: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Especialidad',
    tableName: 'especialidad',
    timestamps: true,
});

module.exports = Especialidad;
