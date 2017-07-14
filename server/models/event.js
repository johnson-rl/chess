'use strict';
module.exports = function(sequelize, DataTypes) {
  var Event = sequelize.define('Event', {
    timestamp: DataTypes.FLOAT,
    order: DataTypes.INTEGER, type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Event.belongsTo(models.Pgn, {as: 'pgn'});
        Event.belongsTo(models.Video, {as: 'video'});
      }
    }
  });
  return Event;
};
