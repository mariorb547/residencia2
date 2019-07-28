'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Proyectos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      filename_plan_trabajo: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      aprobacion_plan_trabajo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      prorroga_fecha_entrega_plan: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }, 
      filename_cronograma: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      aprobacion_cronograma: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      url_informe_tecnico: {
        type: Sequelize.STRING(300),
        allowNull: true,
        defaultValue: null,
        validate: {
          isUrl: {msg: 'La url del informe técnico es obligatoria.'}
        }
      },
      autorizar_carta_liberacion_asesor_interno: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      autorizar_carta_liberacion_asesor_externo: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      id_anteproyecto: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        unique: true,
        allowNull: false,
        references: {
          model: 'anteproyectos',
          key: 'id',
          as: 'id_anteproyecto'
        }
      },
      id_evaluacion_asesor_interno: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: true,
        defaultValue: null
      },
      id_evaluacion_asesor_externo: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: true,
        defaultValue: null
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
    return queryInterface.dropTable('Proyectos');
  }
};