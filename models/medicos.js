// models/Medicos.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Medicos extends Model {}

Medicos.init({
    medicoid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    personaid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    especialidadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Medicos',
    tableName: 'medicos',
    timestamps: true,
});

module.exports = Medicos;
