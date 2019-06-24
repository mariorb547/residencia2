'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subactividades', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_orden: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      actividad: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },    
      id_actividad_general: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'actividades_generales',
          key: 'id',
          as: 'id_actividad_general'
        }
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('subactividades');
  }
};