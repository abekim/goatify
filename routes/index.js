
/*
 * GET home page.
 */
var models = require('../models/models');

exports.index = function(req, res){
  models.Tube.find().exec(function (err, tubes) {
    res.render('index', { title: 'Welcome to Goatify.js', tubes: tubes });
  });
};