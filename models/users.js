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

var userSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    cities: [citySchema]
  });
  
  var userModel = mongoose.model('users', userSchema);
  
  module.exports = userModel;