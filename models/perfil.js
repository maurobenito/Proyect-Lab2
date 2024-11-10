// models/Perfil.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Perfil extends Model {}

Perfil.init({
    perfilid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    permisos: {
        type: DataTypes.STRING(250),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Perfil',
    tableName: 'perfil',
    timestamps: true,
});

module.exports = Perfil;
