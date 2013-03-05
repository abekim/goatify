/*
 * GET home page.
 */
var models = require('../models/models');

var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path');

var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path');

var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path');

exports.index = function(req, res){
  models.Tube.find().exec(function (err, tubes) {
    res.render('index', { title: 'Welcome to Goatify.js', tubes: tubes });
  });
};