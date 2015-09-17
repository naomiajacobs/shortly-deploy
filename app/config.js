var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var Links = mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

module.exports.Link = mongoose.model('Link', Links);

var Users = mongoose.Schema({
  username: String,
  password: String
});

module.exports.User = mongoose.model('User', Users);
