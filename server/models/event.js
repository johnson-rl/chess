'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    timestamp: DataTypes.FLOAT,
    order: DataTypes.INTEGER, type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Event.belongsTo(models.Video)
        Event.belongsTo(models.Pgn)
      }
    }
  });
  return Event;
};
