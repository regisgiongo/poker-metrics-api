'use strict';
import express from 'express';
import path from 'path';
import {pointsPerSprint, pointsPerEndpoints} from './graphics/index';

let app = express();
let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};
const env = process.env;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(allowCrossDomain);

app.get('/:team/issues', (req, res) => {
  let team = req.params.team;
  pointsPerSprint(team, function(points) {
    res.json(points);
  });
});

app.get('/:team/endpoints', (req, res) => {
  let team = req.params.team;
  pointsPerEndpoints(team, function(pointsPerEndpoints) {
    res.json(pointsPerEndpoints);
  });
});

app.get('/:team/endpoints/grouped', (req, res) => {
  let team = req.params.team;
  pointsPerEndpoints(team, function(pointsPerEndpoints) {
    res.json(pointsPerEndpoints);
  }, true);
});

app.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function() {
  console.log(`Application worker ${process.pid} started...`);
});
