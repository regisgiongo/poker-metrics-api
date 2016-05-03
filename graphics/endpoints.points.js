import github from '../config/github';
import async from 'async';
import {onlySprintMilestones, getPoints} from '../utils/utils';

const USER = 'ContaAzul';
const REPO = 'alcatraz';
const ENDPOINTS = ['roadmap', 'bug', 'marketing', 'Cliente', 'métricas', 'AX', 'IS'];

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
