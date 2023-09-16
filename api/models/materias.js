'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    carrera: DataTypes.STRING,
    horas_totales: DataTypes.INTEGER
  }, {});
  materias.associate = function(models) {
    // associations can be defined here
  };
  return materias;
};