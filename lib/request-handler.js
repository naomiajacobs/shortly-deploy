var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var util = require('../lib/utility');

var User = require('../app/config.js').User;
var Link = require('../app/config.js').Link;

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec(function(err, links) {
    if (err) {
      console.log('Error fetching links: ', err);
    } else {
      res.send(200, links);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri}).exec(function(err, found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        } else {
          var shasum = crypto.createHash('sha1');
          shasum.update(uri);
          shasum = shasum.digest('hex').slice(0, 5);
          var newLink = new Link({
            url: uri,
            title: title,
            base_url: req.headers.origin,
            code: shasum,
            visits: 0
          });
          newLink.save(function(err, newLink) {
            if (err) {
              console.log('Error adding new link: ', err);
            } else {
              console.log(newLink);
              res.send(200, newLink);
            }
          });
        }
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username}).exec(function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      bcrypt.compare(password, user.password, function(err, match) {
        if (err) {
          console.log('Wrong password: ', err);
          res.redirect('/login');
        } else {
          util.createSession(req, res, user);
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username}).exec(function(err, user) {
    if (err) {
      console.log('Error checking if user already exists: ', err);
      res.send(404);
    } else {
      if (!user) {
        var newUser = new User({username: username});
        newUser.save(function(err, newUser) {
          if (err) {
            console.log('Error adding new user: ', err);
            res.send(404);
          } else {
            bcrypt.hash(password, null, null, function(err, hash) {
              if (err) {
                console.log('Error adding new user: ', err);
                res.send(404);
              } else {
                newUser.password = hash;
                newUser.save(function(err, newUser) {
                  if (err) {
                    console.log('Error adding new user: ', err);
                    res.send(404);
                  } else {
                    util.createSession(req, res, newUser);
                  }
                });
              }
            });
          }
        });
      } else {
        console.log('Account already exists');
        res.redirect('/login');
      }
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec(function(err, link) {
    if (err) {
      console.log('Error finding link: ', err);
      res.send(404);
    } else {
      if (!link) {
        res.redirect('/');
      } else {
        link.save(function(err, link) {
          if (err) {
            console.log('Error with link: ', err);
            res.send(404);
          } else {
            link.visits = link.visits + 1;
            link.save(function(err, link) {
              if (err) {
                console.log('error saving visits: ', err);
              } else {
                res.redirect(link.url);
              }
            });
          }
        });
      }
    }
  });
};