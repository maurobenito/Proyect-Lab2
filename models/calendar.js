// models/Calendar.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Calendar extends Model {}

Calendar.init({
    calendarid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    agendaid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fechaturno: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    inicioturno: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    finalturno: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Calendar',
    tableName: 'calendar',
    timestamps: true,
});

module.exports = Calendar;
