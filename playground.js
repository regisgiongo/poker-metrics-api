var Github = require('github');
var async = require('async');

var api = new Github({
  version: "3.0.0",
  debug: true,
  protocol: "https"
});

api.authenticate({
  type: 'oauth',
  token: '943f1a03fec32a75162c2a3747a8998a124c872f'
});




api.issues.getAllMilestones({
  user: 'ContaAzul',
  repo: 'alcatraz',
  state: 'closed',
  per_page: 100
}, function(err, res) {
  var milestones = onlySprintMilestones(res);
  var contador = 0;

  async.each(milestones, function(milestone, callback) {
    api.issues.repoIssues({
      user: 'ContaAzul',
      repo: 'alcatraz',
      filter: 'all',
      state: 'all',
      milestone: milestone.number,
      per_page: 100
    }, function(err, issues) {
      var points = issues.reduce(function(pointsAccumulated, issue) {
        return pointsAccumulated + getPoints(issue);
      }, 0);
      callback();
    });
    contador++;
  }, function() {
    console.log('done');
  });

});

function getPoints(issue) {
  var point = issue.title.match(/{(\d+)}/) ? issue.title.match(/{(\d+)}/)[1] : 0;
  return parseInt(point);
}

function onlySprintMilestones(milestones) {
  return milestones.filter(function(item) {
    return item.title.indexOf('Sprint') > -1;
  });
}
