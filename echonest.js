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
  key: process.env.ECHONEST_KEY || "7IHNQPBMVZ3JSVAKQ"
});
var http = require('http');

// http://developer.echonest.com/docs/v4/song.html#search
// var location = 'tswift.mp3';
// fs.readFile(location, function (err, buffer) {
// 	console.log("error: ", err);
//   echo('track/upload').post({
//     filetype: path.extname(location).substr(1)
//   }, 'application/octet-stream', buffer, function (err, json) {
// 	 var md5 = json.response.track.md5;
// 	 console.log("md5: ", md5);
// 	 echo('track/profile').get({
// 	 	md5 : md5,
// 	 	bucket : "audio_summary",
// 	 	format : "json" 
// 	 }, function (err, json) {
// 	 	console.log(json.audio_summary.analysis_url);
// 	 });
//   });
// });

	var md5 = "55decf96c51b2ae39813064555a80f8c";
	 echo('track/profile').get({
	 	md5 : md5,
	 	bucket : "audio_summary",
	 	format : "json" 
	 }, function (err, json) {
	 	var url = json.response.track.audio_summary.analysis_url;
	 	console.log("analysis url:" , url);
		var req = http.get(url, function(res) {  
	        var output = '';
	        res.setEncoding('utf8');
	        res.on('data', function (chunk) {
	            output += chunk;
	        });
	        res.on('end', function() {
	            var obj = JSON.parse(output);
	            // console.log(obj.segments.map(function(each) {
	            // 	return each;
	            // }));
	        });
		}).on('error', function(e) {  
		     console.log("Got error: " + e.message);   
		});   
	 });
