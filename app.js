
/**
 * Module dependencies.
 */

var express = require('express')
  , echojs = require('echojs')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , analyze = require('./routes/analyze')
  , video= require('./routes/video');

var app = express();

app.echo = echojs({
  key: process.env.ECHONEST_KEY || "7IHNQPBMVZ3JSVAKQ"
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/analyze', analyze.analyzeTrack); //post with { video_id: [video_id] }
app.get('/analyze/:video_id', analyze.loadVideo);
app.get('/download',video.downloadVideo);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
