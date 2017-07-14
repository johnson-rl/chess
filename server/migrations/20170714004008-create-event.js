'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timestamp: {
        type: Sequelize.FLOAT
      },
      order: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      VideoId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Videos',
          key: 'id',
          as: 'VideoId',
        }
      },
      PgnId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pgns',
          key: 'id',
          as: 'PgnId',
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Events');
  }
};
