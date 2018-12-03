const express = require('express'),
  router = express.Router(),
  Movie = require('../../models/movie');

// Get ALL Videos Data
router.get('/', (req, res) => {
  Movie.find()
    .sort({ date: -1 })
    .then(movies => res.json({ count: movies.length, videos: movies }));
});

// Get filtered videos
router.get('/:filter', (req, res) => {
  Movie.find({ 'video_data.category': req.params.filter })
    .sort({ date: -1 })
    .then(movies => res.json({ count: movies.length, videos: movies }));
});

router.post('/', (req, res) => {
  const newMovie = new Movie({
    video_data: req.body.video_data
  });

  newMovie.save().then(movie => res.status(201).json(movie));
});

router.delete('/:id', (req, res) => {
  Movie.findByIdAndDelete(req.params.id)
    .then(res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }));
});

module.exports = router;
