if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI:
      'mongodb://zebxu:xlz19950522@ds123434.mlab.com:23434/dream-gallery'
  };
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost:27017/VR'
  };
}
