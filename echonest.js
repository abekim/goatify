// var echojs = require('echojs');

// var echo = echojs({
//   key: process.env.ECHONEST_KEY
// });

// http://developer.echonest.com/docs/v4/song.html#search
// echo('artist/video').get({
//   name: 'radiohead'
//   // title: 'karma police'
// }, function (err, json) {
//   console.log(json.response);
// });

// echo('track/upload').post({
//   artist: 'radiohead',
//   title: 'karma police'
// }, function (err, json) {
//   console.log(json.response)
// });

var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path');

var echo = echojs({
  key: process.env.ECHONEST_KEY
});

// http://developer.echonest.com/docs/v4/song.html#search
var location = __dirname + '/tswift.mp3';
fs.readFile(location, function (err, buffer) {
  echo('track/upload').post({
    filetype: path.extname(location).substr(1)
  }, 'application/octet-stream', buffer, function (err, json) {
    console.log(json.response);
  });
});