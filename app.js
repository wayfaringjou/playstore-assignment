const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());

const playstore = require('./playstore.js')

app.get('/apps', (req, res) => {
  const { search = "", sort, genre} = req.query;

  if (sort) {
    if (!['rating', 'app'].includes(sort)) {
      return res
        .status(400)
        .send('Sort must be one of rating or app');
    }
  }

  if (genre) {
    if (!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre)) {
      return res
        .status(400)
        .send('Genre must be: action, puzzle, strategy, casual, arcade or card.')
    }
  }

  let results = playstore
    .filter(app => 
      app
        .App
        .toLowerCase()
        .includes(search.toLowerCase()));
  

  if (sort) {
    const sortKey = sort.charAt(0).toUpperCase() + sort.slice(1);
    results
      .sort((a, b) => {
        return a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0;
    });
  }

  if (genre) {
    results = results
      .filter(app =>
        app
          .Genres
          .toLowerCase()
          .includes(genre.toLowerCase()));
  }

  res.json(results);
});

module.exports = app;