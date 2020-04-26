var mongoose = require('mongoose');

var citySchema = mongoose.Schema({
    nom: String,
    descriptif: String,
    tMin: Number,
    tMax: Number,
    url: String,
    apiId: Number,
    long: Number,
    lat: Number
  });
  
  var cityModel = mongoose.model('cities', citySchema);
  
  module.exports = cityModel;