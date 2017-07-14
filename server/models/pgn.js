'use strict';
module.exports = function(sequelize, DataTypes) {
  var Pgn = sequelize.define('Pgn', {
    title: DataTypes.STRING,
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Pgn.hasMany(models.Event, {as: 'events'})
      }
    }
  });
  return Pgn;
};
