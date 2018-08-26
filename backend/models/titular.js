'use strict';
module.exports = (sequelize, DataTypes) => {
  var Titular = sequelize.define('Titular', {
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
       notEmpty: {msg: 'El titulo no debe estar vacío.'}
      }
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {msg: 'El nombre no debe estar vacío'},
        min: 15,
      }
    },
    puesto: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {msg: 'El nombre no debe estar vacío'}
      }
    }
  }, {tableName: 'Titulares'});

//   Titular.associate = (models) => {
//   Titular.belongsTo(models.Puesto, {
//     foreignKey: 'id_puesto',
//     onDelete: 'CASCADE',
//     as: 'puesto',
//   });
// }
  return Titular;
};
