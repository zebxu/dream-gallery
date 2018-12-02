const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  path = require('path');

const app = express();

app.use(express.json());
app.use(cors());

const db = require('./config/keys').mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Mongo connected');
  })
  .catch(err => {
    console.error(err);
  });

const movies = require('./routes/api/movies');

app.use('/api/movies', movies);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`sever start on port ${port}`));
