'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('observaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_tarea: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'tareas',
          key: 'id',
          as: 'id_tarea'
        }
      },
      observacion: {
        type: Sequelize.STRING(500)
      },
      tipo_observacion: {
        type: Sequelize.ENUM,
        allowNull: false,
        values: ['plan_de_trabajo', 'revision_semanal','revision_mensual']
      },
      estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },estado_alumno: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },id_asesor_interno: {
        type: Sequelize.INTEGER,
        
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
    return queryInterface.dropTable('observaciones');
  }
};