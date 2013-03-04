var echojs = require('echojs')
  , fs = require('fs')
  , path = require('path')
  , http = require('http');

var num_bins  = 10;
var num_goats = 5;

function getGoatLocs(fileName) {
  fs.readFile(fileName, 'utf8', function (err,data) {
    var tay_analysis = JSON.parse(data);

    var starts = tay_analysis.map(function(each) {
  		return each.start;
  	});
    
    var loudnesses = tay_analysis.map(function(each) {
      return -parseFloat(each.timbre[7]);  //7 and 8 and 9
    });

    var durations = tay_analysis.map(function(each) {
      return parseFloat(each.duration);
    });

    var confidences = tay_analysis.map(function(each) {
      return parseFloat(each.confidence);
    });  

    var binned = binSong(starts, durations, loudnesses, confidences);
    binned.sort(cmp);
    console.log(binned.slice(0,5).map(function(each) {
      return {"start": each[1], "duration" : each[2]};
    }));
  });
}

function cmp(a, b) {
    return b[0] - a[0];
}

function binSong(starts, durations, loudnesses, confidences) {
  //lord have mercy on me
  var spacing       = starts[starts.length-1] / num_bins;
  var nextTarget    = spacing;
  var binned        = [];
  var current_tot   = 0;
  var current_ind   = 0;
  var test = [];
  for (i=0; i<loudnesses.length; i++) {
    test.push([starts[i], loudnesses[i]]);
    if (starts[i] > nextTarget) {
      binned.push([current_tot / current_ind,  starts[i] - spacing, spacing]);
      current_tot  = 0;
      current_ind  = 0;
      nextTarget += spacing;
    }
    else {
      current_tot  += parseFloat(loudnesses[i]);
      current_ind  += 1;
    }
  }
  fs.writeFile("new_tay.txt", JSON.stringify(test));
  return binned;
}

getGoatLocs('tay.mp3.txt');

// var average = a.reduce(function(a, b) { return a + b; }, 0)