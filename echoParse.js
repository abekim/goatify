var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path')
  , http = require('http');

var num_bins  = 50;
var num_goats = 5;

var echo = echojs({
  key: process.env.ECHONEST_KEY || "7IHNQPBMVZ3JSVAKQ"
});

var location = 'tay.mp3';
fs.readFile(location, function (err, buffer) {
  console.log("error: ", err);
  echo('track/upload').post({
    filetype: path.extname(location).substr(1)
  }, 'application/octet-stream', buffer, function (err, json) {
	 var md5 = json.response.track.md5;
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
	            var timbre = obj.segments.map(function(each) {
	            	return each;
	            });
	            var starts = timbre.map(function(each) {
			  		return each.start;
			  	});
			    
			    var loudnesses = timbre.map(function(each) {
			      return -parseFloat(each.timbre[7]);  //7 and 8 and 9 are good for tswift
			    });

			    var durations = timbre.map(function(each) {
			      return parseFloat(each.duration);
			    });

			    var confidences = timbre.map(function(each) {
			      return parseFloat(each.confidence);
			    });  

			    var binned = binSong(starts, durations, loudnesses, confidences);
			    binned.sort(cmp);
			    console.log(binned.slice(0,5).map(function(each) {
			      return {"start": each[1], "duration" : each[2]};
			    }));
			  });
		}).on('error', function(e) {  
		     console.log("Got error: " + e.message);   
		});   
	 }); 	 
  });
});

function cmp(a, b) {
    return b[0] - a[0];
}

//bins the song into x regions and returns the average loudness of the region, the beginning of the region
function binSong(starts, durations, loudnesses, confidences) {
  //lord have mercy on me
  var spacing       = starts[starts.length-1] / num_bins;
  var nextTarget    = spacing;
  var binned        = [];
  var current_tot   = 0;
  var current_ind   = 0;
  for (i=0; i<loudnesses.length; i++) {
    if (starts[i] > nextTarget) {
      binned.push([current_tot / current_ind, starts[i] - spacing, spacing]);
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