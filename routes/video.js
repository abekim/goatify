var youtubedl = require('youtube-dl')
    , ffmpeg = require('fluent-ffmpeg')
    , analyze = require('./analyze')
    , fs = require('fs');

exports.skipDownload=function(req,res){
  var tubeID = req.params.video_id;
  analyze.analyzeTrack('./'+tubeID+'.mp3',tubeID,res);
}
exports.downloadVideo=function(req,res){
  var id = req.params.video_url.substr(req.params.video_url.indexOf('v=') + 2, 11);
  var tubeID = req.params.video_id;

  fs.exists(tubeID+'.mp3', function(exists) {
      if (exists) {
        console.log('shortcutting dl. file already exists')
        analyze.analyzeTrack('./'+tubeID+'.mp3',tubeID,res);
      } else {
        var dl = youtubedl.download('http://www.youtube.com/watch?v='+tubeID,
          './',['--max-quality=18',]);
        // will be called when the download starts
        dl.on('download', function(data) {
          console.log('Download started');
          console.log('filename: ' + data.filename);
          console.log('size: ' + data.size);
        });


        // catches any errors
        dl.on('error', function(err) {
          throw err;
        });

        // called when youtube-dl finishes
        dl.on('end', function(data) {
          console.log('\nDownload finished!');
          console.log(data)
          console.log('Filename: ' + data.filename);
          console.log('Size: ' + data.size);
          console.log('Time Taken: ' + data.timeTaken);
          console.log('Time Taken in ms: ' + data.timeTakenms);
          console.log('Average Speed: ' + data.averageSpeed);
          console.log('Average Speed in Bytes: ' + data.averageSpeedBytes);
          var proc = new ffmpeg({ source: data.filename })
          .saveToFile('./'+tubeID+'.mp3', function(out, err) {
            console.log(tubeID+'.mp3')
            if (err){
              console.log(err)
            }
            console.log('conversion out: ',out)
            console.log('file has been converted succesfully');
            analyze.analyzeTrack('./'+tubeID+'.mp3',tubeID,res);
          });
        });
      }
    });
}