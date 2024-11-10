// models/Persona.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Persona extends Model {}

Persona.init({
    personaid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    dni: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    localidad: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    telefono: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    mail: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Persona',
    tableName: 'persona',
    timestamps: true,
});

module.exports = Persona;
