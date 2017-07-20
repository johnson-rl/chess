'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    timestamp: DataTypes.FLOAT,
    fen: DataTypes.STRING, move: DataTypes.STRING, pgn: DataTypes.TEXT
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
