mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/youtube');

var youtubeSchema = mongoose.Schema({	video_id : String,
								    analysis : [Object]
								 });

var Tube = mongoose.model('Tube', youtubeSchema);
exports.Tube = Tube;