'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    horas_totales: DataTypes.INTEGER,
    id_carrera: DataTypes.INTEGER
  }, {});
  materias.associate = function(models) {
    

    materias.belongsTo(models.carrera// modelo al que pertenece
    ,{
      as : 'Carrera-Relacionada',  // nombre de mi relacion
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    })

    materias.belongsTo(models.profesor// modelo al que pertenece
    ,{
      as : 'profe-materia',  // nombre de mi relacion
      foreignKey: 'id_materia'     // campo con el que voy a igualar
    })



  };
  return materias;
};