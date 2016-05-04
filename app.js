'use strict';
import express from 'express';
import path from 'path';
import {pointsPerSprint, pointsPerEndpoints} from './graphics/index';

let app = express();
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
};
const env = process.env;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(allowCrossDomain);

app.get('/issues', (req, res) => {
  pointsPerSprint(function(points) {
    res.json(points);
  });
});

app.get('/endpoints', (req, res) => {
  pointsPerEndpoints(function(pointsPerEndpoints) {
    res.json(pointsPerEndpoints);
  });
});

app.get('/endpoints/grouped', (req, res) => {
  pointsPerEndpoints(function(pointsPerEndpoints) {
    res.json(pointsPerEndpoints);
  }, true);
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
  console.log(`Application worker ${process.pid} started...`);
});
