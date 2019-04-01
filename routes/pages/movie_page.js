const express = require('express'),
  router = express.Router(),
  axios = require('axios');

router.get('/:vid', (req, res) => {
  axios
    .get(`https://api.avgle.com/v1/video/${req.params.vid}`)
    .then(api_res => {
      if (api_res.data.success) {
        // console.log(api_res.data.response);
        const video = api_res.data.response.video;
        res.render('index', {
          video,
          ...video,
          content: 'fuck',
          duration: `${Math.floor(video.duration / 3600)}:${Math.floor(
            (video.duration % 3600) / 60
          )}:${Math.floor(video.duration % 60)}`,
          viewnumber: parseInt(video.viewnumber).toLocaleString(),
          keyword: video.keyword.split(' ')
        });
      } else {
        res.send('Fail');
      }
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = router;
