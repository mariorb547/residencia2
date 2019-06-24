'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tareas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_subactividad: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'subactividades',
          key: 'id',
          as: 'id_subactividades'
        }
      },id_orden: {
        allowNull: false,
        type: Sequelize.STRING(10)
      },
      tarea: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      horas: {
        type: Sequelize.INTEGER,
       
      },
     entregable: {
        type: Sequelize.STRING(400),
        allowNull: true,
      },
      fecha_entrega: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },      
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      estado_revision_plan:{
        type: Sequelize.ENUM,
        values: ['revision','aprobado','no aprobado'],
        allowNull: false,
        defaultValue: 'revision'
      }, 
      estado_revision_semanal:{
        type: Sequelize.ENUM,
        values: ['revision','aprobado','no aprobado'],
        allowNull: false,
        defaultValue: 'revision'
      },
      estado_revision_mensual:{
        type: Sequelize.ENUM,
        values: ['revision','aprobado','no aprobado'],
        allowNull: false,
        defaultValue: 'revision'
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tareas');
  }
};