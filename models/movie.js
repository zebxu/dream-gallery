const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const MovieSchema = new Schema({
  video_data: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('movie', MovieSchema);
