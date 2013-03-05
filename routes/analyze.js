var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path')
  , http = require('http')
  , models = require("../models/models")
  , video = require("./video");

var echo = echojs({
  key: process.env.ECHONEST_KEY || "7IHNQPBMVZ3JSVAKQ"
});

var num_bins  = 10;
var num_goats = 5;

// var location = 'screaming-goat.mp3';
// var id       = 'sample';                //this would be the youtube video id

exports.analyzeTrack = function(location, id,res) {
  console.log(res);
  models.Tube.findOne({video_id : id}, function(err, vid) {
    if (vid) {
      // return vid.locs;
      res.render('analyze', {title : "Found result", locs : JSON.parse(vid.locs)});
    }
    else  {
      console.log(location);
      fs.readFile(location, function (err, buffer) {
        console.log("error: ", (err) ? err : "None");
        echo('track/upload').post({
        filetype: path.extname(location).substr(1)
      }, 'application/octet-stream', buffer, function (err, json) {
    	echo('track/profile').get({md5 : json.response.track.md5, bucket : "audio_summary",	format : "json" }, function (err, json) {
    	var url = json.response.track.audio_summary.analysis_url;
    	console.log("analysis url:" , url);
    	var req = http.get(url, function(ress) {  
    	  var output = '';
    	  ress.setEncoding('utf8');
    	  ress.on('data', function (chunk) {
    	    output += chunk;
    	  });
    	  ress.on('end', function() {
    	    var segments = JSON.parse(output).segments;
          var starts   = segments.map(function(each) {
    				return each.start;
    			});
    			var loudnesses = segments.map(function(each) {
    			  return -parseFloat(each.timbre[7]);  //7 and 8 and 9 are good for tswift
    			});
    			var binned = binSong(starts, loudnesses);
    			binned.sort(cmp);
    			var goatLocs = binned.slice(0,num_goats).map(function(each) {
    			  return {"start": each[1], "duration" : each[2]};
    			});
          var tube = new models.Tube({video_id : id, locs : JSON.stringify(goatLocs)});
          tube.save(function(err) {
            console.log(err);
            // return locs;
            res.render('analyze', {title : "sample result", locs : goatLocs});
            });
   			  });
     	  }); 
       }); 	 
     });
   });
  }
 });
}

function cmp(a, b) {
    return b[0] - a[0];
}

//bins the song into x regions and returns the average loudness of the region and the beginning of the region
function binSong(starts, loudnesses) {
  //lord have mercy on me

  var spacing       = starts[starts.length-1] / num_bins;
  var nextTarget    = spacing;
  var binned        = [];
  var current_tot   = 0;
  var current_ind   = 0;
  for (i=0; i<loudnesses.length; i++) {
    if (starts[i] > nextTarget) {
      binned.push([current_tot / current_ind, starts[i] - spacing/2.0, (Math.random(1) + 1) / 2.0
]);
      current_tot  = 0;
      current_ind  = 0;
      nextTarget += spacing;
    }
    else {
      current_tot  += parseFloat(loudnesses[i]);
      current_ind  += 1;
    }
  }
  return binned;
}

//render video
exports.loadVideo = function (req, res) {
  console.log("video yet to be loaded");
};
