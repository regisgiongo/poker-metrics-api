import github from '../config/github';
import async from 'async';
import settings from 'config';
import {onlySprintMilestones, getPoints} from '../utils/utils';

const ENDPOINTS = [{
      name: 'roadmap'
    }, {
      name: 'bug'
    }, {
      name: 'marketing'
    }, {
      name: 'Cliente',
      grouped: 'marketing'
    }, {
      name: 'métricas',
      grouped: 'marketing'
    }, {
      name: 'AX',
      grouped: 'marketing'
    }, {
      name: 'IS',
      grouped: 'marketing'
    }];

export function pointsPerEndpoints(team, callback, grouped) {
  let access = settings.github[team];

  getTagsPointsByMilestone((milestoneTagsPoints) => {
    var sumPointsTags = getEndpointsInitialValues(grouped);
    for (var milestone in milestoneTagsPoints) {
      var endpoints = milestoneTagsPoints[milestone];
      for (var endpoint in milestoneTagsPoints[milestone]) {
        var customEndpoint = (grouped) ? group(endpoint) : endpoint;
        sumPointsTags[customEndpoint] += milestoneTagsPoints[milestone][endpoint];
      }
    }
    callback(sumPointsTags);
  });

  function group(endpoint) {
    endpoint = getEndpoint(endpoint);
    return (endpoint.grouped) ? endpoint.grouped : endpoint.name;
  }

  function getTagsPointsByMilestone(callback) {
    github.issues.getAllMilestones({
      user: access.user,
      repo: access.repo,
      state: 'closed',
      per_page: 100,
      sort : 'completeness'
    }, (err, res) => {
      let milestones = onlySprintMilestones(res);
      var issuesByEndpoint = {};

      async.each(milestones, (milestone, next) => {
        issuesByEndpoint[milestone.title] = getEndpointsInitialValues();
        github.issues.repoIssues({
          user: access.user,
          repo: access.repo,
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

  function getEndpointsInitialValues(isGrouped) {
    var obj = {};
    for (var i = 0; i < ENDPOINTS.length; i++) {
      if (isGrouped && ENDPOINTS[i].grouped) continue;
      obj[ENDPOINTS[i].name] = 0;
    }
    return obj;
  }

  function getEndpointTag(tags) {
    return tags.filter( (tag) => {
      return ENDPOINTS.filter((endpoint) => {
        return tag.name === endpoint.name;
      }).length;
    } )[0];
  }

  function getEndpoint(key) {
    for (var i = 0; i < ENDPOINTS.length; i++)
      if (ENDPOINTS[i].name === key) return ENDPOINTS[i];
  }
}
