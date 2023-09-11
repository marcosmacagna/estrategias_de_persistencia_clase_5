'use strict';
module.exports = (sequelize, DataTypes) => {
  const notas = sequelize.define('notas', {
    primer_parcial: DataTypes.INTEGER,
    segundo_parcial: DataTypes.INTEGER,
    tp: DataTypes.INTEGER
  }, {});
  notas.associate = function(models) {
    // associations can be defined here
  };
  return notas;
};