var mongoose = require('mongoose');

var location = process.env.PORT ? 'mongodb://MongoLabShortly:Hf70WiO5lMqftsTwDawtkn9KdZKpGP8yEiXROX05zrE-@ds042698.mongolab.com:42698/MongoLabShortly' : 'mongodb://localhost/test';

mongoose.connect(location);

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
