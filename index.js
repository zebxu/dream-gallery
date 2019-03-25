const express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  path = require('path'),
  hbs = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', 'hbs');

// const db = require('./config/keys').mongoURI;

// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log('Mongo connected');
//   })
//   .catch(err => {
//     console.error(err);
//   });

// const movies = require('./routes/api/movies');
const pages = require('./routes/pages/movie_page');

// app.use('/api/movies', movies);
app.use('/movie', pages);
app.use(express.static('client/src/semantic/dist'));

if (process.env.NODE_ENV === 'production') {
}
app.use(express.static('./client/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`sever start on port ${port}`));
