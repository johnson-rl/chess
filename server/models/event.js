'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    timestamp: DataTypes.FLOAT,
    fen: DataTypes.STRING, type: DataTypes.STRING, chessMove: DataTypes.JSON, pgn: DataTypes.STRING, videoHash: DataTypes.STRING, move: DataTypes.STRING
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
