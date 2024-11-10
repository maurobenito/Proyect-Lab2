// models/Estado.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Estado extends Model {}

Estado.init({
    estadoid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Estado',
    tableName: 'estado',
    timestamps: true,
});

module.exports = Estado;
