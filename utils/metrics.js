import github from '../config/github';
import async from 'async';

const USER = 'ContaAzul';
const REPO = 'alcatraz';
const ENDPOINTS = ['roadmap', 'bug', 'marketing'];

export function pointsPerSprint(callback) {
  github.issues.getAllMilestones({
    user: USER,
    repo: REPO,
    state: 'closed',
    per_page: 100
  }, (err, res) => {
    let milestones = onlySprintMilestones(res);
    let points = {};

    async.each(milestones, (milestone, next) => {
      points[milestone.title] = 0;
      github.issues.repoIssues({
        user: USER,
        repo: REPO,
        filter: 'all',
        state: 'all',
        milestone: milestone.number,
        per_page: 100
      }, (err, issues) => {
        points[milestone.title] = sumIssuesPoints(issues);
        next();
      });
    }, () => {
      callback(points);
    });
  });
}

export function pointsPerEndpoints(callback) {
  getTagsPointsByMilestone((milestoneTagsPoints) => {
    var sumPointsTags = getEndpointsInitialValues();
    for (var milestone in milestoneTagsPoints) {
      var endpoints = milestoneTagsPoints[milestone];
      for (var endpoint in milestoneTagsPoints[milestone])
        sumPointsTags[endpoint] += milestoneTagsPoints[milestone][endpoint];
    }
    callback(sumPointsTags);
  });
}


// Cria um service só para os pontos por endpoint
function getTagsPointsByMilestone(callback) {
  github.issues.getAllMilestones({
    user: USER,
    repo: REPO,
    state: 'closed',
    per_page: 100
  }, (err, res) => {
    let milestones = onlySprintMilestones(res);
    var issuesByEndpoint = {};

    async.each(milestones, (milestone, next) => {
      issuesByEndpoint[milestone.title] = getEndpointsInitialValues();
      github.issues.repoIssues({
        user: USER,
        repo: REPO,
        filter: 'all',
        state: 'all',
        milestone: milestone.number,
        per_page: 100
      }, (err, issues) => {
        for (var i = 0; i < issues.length; i++) {
          let tags = issues[i].labels;
          if (getEndpointTag(tags)){
            var tag = getEndpointTag(tags).name;
            issuesByEndpoint[milestone.title][tag] += getPoints(issues[i]);
          }
        }
        next();
      });
    }, () => {
      callback(issuesByEndpoint);
    });
  });
}

function getEndpointsInitialValues() {
  var obj = {};
  for (var i = 0; i < ENDPOINTS.length; i++) {
    obj[ENDPOINTS[i]] = 0;
  }
  return obj;
}

function getEndpointTag(tags) {
  return tags.filter( (tag) => {
    return ENDPOINTS.filter((endpoint) => {
      return tag.name === endpoint;
    }).length;
  } )[0];
}

// Outro service
function onlySprintMilestones(milestones) {
  return milestones.filter( (item) => {
    return item.title.indexOf('Sprint') > -1;
  });
}

function sumIssuesPoints(issues) {
  return issues.reduce( (pointsAccumulated, issue) => {
    return pointsAccumulated + getPoints(issue);
  }, 0);
}

function getPoints(issue) {
  let point = issue.title.match(/{(\d+)}/) ? issue.title.match(/{(\d+)}/)[1] : 0;
  return parseInt(point);
}
