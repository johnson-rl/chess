'use strict';
module.exports = function(sequelize, DataTypes) {
  var Video = sequelize.define('Video', {
    title: DataTypes.STRING,
    videoHash: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Video.hasMany(models.Event, {as: 'events'})
      }
    }
  });
  return Video;
};
