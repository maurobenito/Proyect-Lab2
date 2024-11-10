// models/MedicoEsp.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class MedicoEsp extends Model {}

MedicoEsp.init({
    matricula: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    medicoid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    especialidadid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'MedicoEsp',
    tableName: 'medico_esp',
    timestamps: true,
});

module.exports = MedicoEsp;
